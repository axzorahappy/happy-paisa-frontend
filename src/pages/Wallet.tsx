import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Coins, PiggyBank, ArrowUpRight, ArrowDownRight, Gift, RotateCcw, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { httpSupabaseAPI, WalletTransaction, WalletBalances } from '../services/httpSupabaseAPI';

interface LocalWalletBalances {
  happyCoins: number;    // HC (purchased with real money)
  happyPaisa: number;    // Earned from games
  stakedAmount: number;  // Currently staked
  totalEarned: number;   // Lifetime earnings
}

export default function WalletPage() {
  const [balances, setBalances] = useState<LocalWalletBalances>({
    happyCoins: 0,
    happyPaisa: 2450, // Mock data - from games
    stakedAmount: 0,
    totalEarned: 2450
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertAmount, setConvertAmount] = useState('');
  const [showBuyCoins, setShowBuyCoins] = useState(true);
  const [showStaking, setShowStaking] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [showStakeConfirm, setShowStakeConfirm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedStake, setSelectedStake] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  const { isAuthenticated, profile, user } = useAuth();
  
  // Conversion rate: 1000 Happy Paisa = 1 HC
  const conversionRate = 0.001;
  useEffect(() => {
    loadWalletData();
  }, [isAuthenticated, profile, user]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated && user?.id) {
        try {
          // Load real wallet balances from Supabase
          const walletBalances = await httpSupabaseAPI.getWalletBalances(user.id);
          setBalances(walletBalances);
          
          // Load wallet ledger transactions
          const ledgerData = await httpSupabaseAPI.getWalletLedger(user.id, 10);
          // Convert ledger entries to transaction format for display
          const transactions: WalletTransaction[] = ledgerData.map(entry => ({
            id: entry.id,
            user_id: entry.user_id,
            type: (entry.type === 'conversion' || entry.type === 'purchase') ? 'earned' as const : 
                  entry.type === 'stake' ? 'spent' as const : 'bonus' as const,
            amount: Math.abs(entry.happy_paisa) || Math.abs(entry.happy_coins * 1000),
            description: entry.description,
            created_at: entry.created_at
          }));
          setTransactions(transactions);
        } catch (apiError) {
          console.log('API not available, using mock data:', apiError);
          // Fallback to mock data if Supabase is not set up yet
          setBalances({
            happyCoins: 0,
            happyPaisa: 2450,
            stakedAmount: 0,
            totalEarned: 2450
          });
          setTransactions(generateMockTransactions());
        }
      } else {
        // Guest mode - no wallet data
        setBalances({
          happyCoins: 0,
          happyPaisa: 0,
          stakedAmount: 0,
          totalEarned: 0
        });
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      // Set default values
      setBalances({
        happyCoins: 0,
        happyPaisa: 0,
        stakedAmount: 0,
        totalEarned: 0
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockTransactions = (): WalletTransaction[] => [
    {
      id: '1',
      user_id: user?.id || 'mock',
      type: 'earned',
      amount: 150,
      description: 'Word Puzzle Game Completed',
      game_type: 'puzzle',
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      user_id: user?.id || 'mock',
      type: 'bonus',
      amount: 200,
      description: 'Daily Login Bonus',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];


  const handleConvertPaisaToCoins = async () => {
    if (!convertAmount || parseInt(convertAmount) <= 0) {
      alert('⚠️ Please enter a valid amount to convert');
      return;
    }
    
    const amount = parseInt(convertAmount);
    if (amount < 1000) {
      alert('💵 Minimum conversion is 1000 Happy Paisa (1 HC)\n\nTip: Play more games to earn Happy Paisa!');
      return;
    }
    
    if (amount > balances.happyPaisa) {
      alert(`⚠️ Insufficient Balance!\n\nYou have: ${balances.happyPaisa.toLocaleString()} Happy Paisa\nYou need: ${amount.toLocaleString()} Happy Paisa\n\n🎮 Play games to earn more Happy Paisa!`);
      return;
    }
    
    setLoading(true);
    try {
      if (isAuthenticated && user) {
        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Real conversion API call
        // const result = await api('/api/rewards/convert', {
        //   method: 'POST',
        //   body: JSON.stringify({ rewardsToConvert: amount })
        // });
        
        // Real conversion using Supabase API
        const result = await httpSupabaseAPI.convertHappyPaisaToCoins(user.id, amount);
        
        if (result.success) {
          // Refresh balances after successful conversion
          const updatedBalances = await httpSupabaseAPI.getWalletBalances(user.id);
          setBalances(updatedBalances);
          
          setConvertAmount('');
          alert(`🎉 Conversion Successful!\n\n✅ Converted ${amount.toLocaleString()} Happy Paisa\n→ ${result.hcGained.toFixed(3)} HC\n\n💰 Your new HC balance is ready to use!`);
        }
      } else {
        alert('👋 Please sign in first to convert Happy Paisa.')
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('❌ Conversion failed. Please try again.\n\nIf the problem persists, contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  // Currency conversion rates (base: USD)
  // 1 HC = ₹1000, so for 10 HC = $9.99, we need ₹10,000 = $9.99
  // Rate = 10000 / 9.99 = ~1001 INR per USD for our custom HC pricing
  const currencyRates = {
    USD: 1,
    EUR: 0.85,
    INR: 1001  // 1 HC = ₹1000 (10 HC = ₹10,010 for $9.99)
  };
  
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    INR: '₹'
  };
  
  const convertPrice = (priceUSD: number, currency: string) => {
    return priceUSD * currencyRates[currency as keyof typeof currencyRates];
  };
  
  const formatPrice = (price: number, currency: string) => {
    const symbol = currencySymbols[currency as keyof typeof currencySymbols];
    return `${symbol}${price.toFixed(2)}`;
  };

  const handleBuyCoins = async (amount: number, priceUSD: number, label: string) => {
    if (!isAuthenticated) {
      alert('👋 Please sign in first to purchase Happy Coins!');
      return;
    }
    
    const convertedPrice = convertPrice(priceUSD, selectedCurrency);
    const formattedPrice = formatPrice(convertedPrice, selectedCurrency);
    
    setSelectedPackage({ amount, priceUSD, label, convertedPrice, formattedPrice });
    setShowBuyConfirm(true);
  };
  
  const confirmBuyCoins = async () => {
    setProcessing(true);
    setShowBuyConfirm(false);
    
    // Simulate processing delay
    setTimeout(() => {
      setProcessing(false);
      alert(`🎉 Purchase Confirmed!\n\n${selectedPackage.amount} HC for ${selectedPackage.formattedPrice}\n\n✅ This will redirect to Stripe checkout when integrated.`);
      setSelectedPackage(null);
    }, 1500);
  };
  
  const handleStake = async (amount: number, days: number, apy: number, label: string) => {
    if (!isAuthenticated) {
      alert('👋 Please sign in first to stake Happy Coins!');
      return;
    }
    
    if (amount > balances.happyCoins) {
      alert('⚠️ Insufficient Happy Coins! You need at least ' + amount + ' HC to stake.');
      return;
    }
    
    setSelectedStake({ amount, days, apy, label });
    setShowStakeConfirm(true);
  };
  
  const confirmStake = async () => {
    setProcessing(true);
    setShowStakeConfirm(false);
    
    try {
      if (isAuthenticated && user?.id) {
        // Real staking using Supabase API
        await httpSupabaseAPI.createStakingPosition(
          user.id, 
          selectedStake.amount, 
          selectedStake.days, 
          selectedStake.apy
        );
        
        // Refresh balances after successful staking
        const updatedBalances = await httpSupabaseAPI.getWalletBalances(user.id);
        setBalances(updatedBalances);
        
        setProcessing(false);
        alert(`🎉 Staking Confirmed!\n\n${selectedStake.amount} HC staked for ${selectedStake.days} days\nAPY: ${selectedStake.apy}%\n\n✅ Your coins are now earning rewards!`);
        setSelectedStake(null);
      }
    } catch (error) {
      setProcessing(false);
      console.error('Staking error:', error);
      alert(`❌ Staking failed: ${(error as Error).message}\n\nPlease try again or check your balance.`);
    }
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <ArrowDownRight className="w-4 h-4 text-green-400" />;
      case 'spent': return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'bonus': return <Gift className="w-4 h-4 text-yellow-400" />;
      case 'refund': return <RotateCcw className="w-4 h-4 text-blue-400" />;
      default: return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Loading wallet data...</span>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">💰 My Wallet</h1>
        <motion.button
          onClick={loadWalletData}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Happy Coins (HC)</p>
              <h2 className="text-3xl font-bold text-white">{balances.happyCoins?.toLocaleString() || '0'}</h2>
              <p className="text-blue-400 text-lg font-semibold">Purchased</p>
            </div>
            <Wallet className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Happy Paisa</p>
              <h2 className="text-3xl font-bold text-white">{balances.happyPaisa?.toLocaleString() || '0'}</h2>
              <p className="text-green-400 text-lg font-semibold">From Games</p>
            </div>
            <Coins className="w-12 h-12 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Staked Amount</p>
              <h2 className="text-3xl font-bold text-white">{balances.stakedAmount?.toLocaleString() || '0'}</h2>
              <p className="text-purple-400 text-lg font-semibold">Locked</p>
            </div>
            <PiggyBank className="w-12 h-12 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm">Total Earned</p>
              <h2 className="text-3xl font-bold text-white">{balances.totalEarned?.toLocaleString() || '0'}</h2>
              <p className="text-yellow-400 text-lg font-semibold">Lifetime</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Buy Coins Section - Always Visible */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">💳 Buy Happy Coins</h3>
              <p className="text-white/70">Purchase HC with real money via Stripe</p>
            </div>
          </div>
          
          {/* Currency Selector */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">Currency:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="USD" className="bg-gray-800">🇺🇸 USD</option>
              <option value="EUR" className="bg-gray-800">🇪🇺 EUR</option>
              <option value="INR" className="bg-gray-800">🇮🇳 INR</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { hc: 10, priceUSD: 9.99, popular: false, label: 'Basic' },
            { hc: 25, priceUSD: 19.99, popular: true, label: 'Popular' },
            { hc: 50, priceUSD: 34.99, popular: false, label: 'Premium' },
          ].map((pkg, i) => {
            const convertedPrice = convertPrice(pkg.priceUSD, selectedCurrency);
            const formattedPrice = formatPrice(convertedPrice, selectedCurrency);
            const pricePerHC = convertedPrice / pkg.hc;
            
            return (
              <motion.div
                key={i}
                className={`relative border rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors ${
                  pkg.popular 
                    ? 'border-purple-400 bg-purple-500/20' 
                    : 'border-white/20 bg-white/5'
                }`}
                onClick={() => handleBuyCoins(pkg.hc, pkg.priceUSD, pkg.label)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {pkg.label.toUpperCase()}
                  </div>
                )}
                <div className="text-3xl font-bold text-white mb-2">{pkg.hc} HC</div>
                <div className="text-2xl text-green-400 font-bold mb-1">{formattedPrice}</div>
                <div className="text-sm text-white/60">{formatPrice(pricePerHC, selectedCurrency)}/HC</div>
                <div className="mt-4">
                  <motion.button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-purple-500/25'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/25'
                    } hover:shadow-xl transform hover:-translate-y-0.5`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={`Click to purchase ${pkg.hc} Happy Coins for ${formattedPrice}`}
                  >
                    🛍️ Buy {pkg.label}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span>Secure Stripe Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-400" />
              <span>Instant HC Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Staking Section - Always Visible */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <PiggyBank className="w-8 h-8 text-purple-400" />
          <div>
            <h3 className="text-2xl font-bold text-white">🏦 Stake Happy Coins</h3>
            <p className="text-white/70">Stake your Happy Coins to earn rewards over time</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { days: 7, apy: 5, minStake: 10, label: 'Short Term' },
            { days: 30, apy: 8, minStake: 25, label: 'Medium Term', popular: true },
            { days: 90, apy: 12, minStake: 50, label: 'Long Term' },
          ].map((option, i) => (
            <motion.div
              key={i}
              className={`relative border rounded-lg p-6 text-center cursor-pointer hover:bg-white/10 transition-colors ${
                option.popular
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-white/20 bg-white/5'
              }`}
              onClick={() => handleStake(option.minStake, option.days, option.apy, option.label)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>
              )}
              <div className="text-3xl font-bold text-white mb-2">{option.days} Days</div>
              <div className="text-2xl text-green-400 font-bold mb-1">{option.apy}% APY</div>
              <div className="text-sm text-white/60 mb-4">Min: {option.minStake} HC</div>
              <motion.button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                  option.popular
                    ? 'bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white shadow-purple-500/25'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/25'
                } hover:shadow-xl transform hover:-translate-y-0.5`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={`Stake ${option.minStake} HC for ${option.days} days at ${option.apy}% APY`}
              >
                🏦 Stake {option.label}
              </motion.button>
              <div className="mt-2 text-xs text-white/50">Lock period: {option.days} days</div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-sm">
                <strong className="text-white">Current Staked:</strong> {balances.stakedAmount} HC
              </p>
              <p className="text-white/70 text-sm mt-1">
                <strong className="text-white">Available to Stake:</strong> {balances.happyCoins} HC
              </p>
            </div>
            <div className="text-sm text-white/60">
              <p><strong className="text-yellow-400">⚠️ Important:</strong></p>
              <p>Staked coins are locked for the selected period. Early withdrawal may incur penalties.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Convert Paisa to HC Section */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🔄 Convert Happy Paisa to Happy Coins</h3>
        <p className="text-white/70 mb-6">Convert your earned Happy Paisa to Happy Coins! (Rate: 1000 Happy Paisa = 1 HC)</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              placeholder="Amount to convert (e.g. 1000)"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="1000"
              max={balances.happyPaisa}
            />
          </div>
          <div className="text-white/70 text-sm">
            ≈ {convertAmount ? ((parseInt(convertAmount) || 0) * conversionRate).toFixed(3) : '0.000'} HC
          </div>
        </div>

        <motion.button
          onClick={handleConvertPaisaToCoins}
          disabled={loading || !convertAmount || parseInt(convertAmount) < 1000}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:-translate-y-0.5 disabled:hover:transform-none"
          whileHover={!loading && convertAmount && parseInt(convertAmount) >= 1000 ? { scale: 1.02 } : {}}
          whileTap={!loading && convertAmount && parseInt(convertAmount) >= 1000 ? { scale: 0.98 } : {}}
          title={convertAmount && parseInt(convertAmount) >= 1000 ? `Convert ${convertAmount} Happy Paisa to ${((parseInt(convertAmount) || 0) * conversionRate).toFixed(3)} HC` : 'Enter at least 1000 Happy Paisa to convert'}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
              Converting...
            </div>
          ) : (
            <span className="inline-flex items-center justify-center gap-3">
              <RotateCcw className="w-6 h-6" />
              <span className="text-lg">🔄 Convert to HC</span>
              {convertAmount && parseInt(convertAmount) >= 1000 && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  +{((parseInt(convertAmount) || 0) * conversionRate).toFixed(3)} HC
                </span>
              )}
            </span>
          )}
        </motion.button>
        
        <div className="mt-4 text-xs text-white/50 text-center">
          Minimum conversion: 1000 Happy Paisa = 1 HC • Instant conversion
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 Transaction History</h3>
        <p className="text-white/70 mb-6">Your recent Happy Paisa activity</p>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                  <p className="font-medium text-white">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-white/60">
                      <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(transaction.created_at).toLocaleTimeString()}</span>
                      {transaction.game_type && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{transaction.game_type}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaction.type === 'earned' || transaction.type === 'bonus' || transaction.type === 'refund'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {transaction.type === 'spent' ? '-' : '+'}{transaction.amount} Happy Paisa
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No transactions yet</p>
              <p className="text-white/50 text-sm">Play games to start earning Happy Paisa!</p>
            </div>
          )}
        </div>
        
        {transactions.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View All Transactions
            </button>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      {processing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">⏳ Processing...</h3>
            <p className="text-white/70">Please wait while we process your request</p>
          </motion.div>
        </motion.div>
      )}

      {/* Buy Confirmation Modal */}
      {showBuyConfirm && selectedPackage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowBuyConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">💳 Confirm Purchase</h3>
              <p className="text-white/70">You're about to purchase Happy Coins</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Package:</span>
                <span className="text-white font-semibold">{selectedPackage.label}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Amount:</span>
                <span className="text-white font-semibold">{selectedPackage.amount} HC</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Price:</span>
                <span className="text-green-400 font-bold text-xl">{selectedPackage.formattedPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Rate:</span>
                <span className="text-white/80">{formatPrice(selectedPackage.convertedPrice / selectedPackage.amount, selectedCurrency)}/HC</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={() => setShowBuyConfirm(false)}
                className="flex-1 py-3 px-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmBuyCoins}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🚀 Confirm Purchase
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Stake Confirmation Modal */}
      {showStakeConfirm && selectedStake && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowStakeConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900/90 to-green-900/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">🏦 Confirm Staking</h3>
              <p className="text-white/70">You're about to stake Happy Coins</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Plan:</span>
                <span className="text-white font-semibold">{selectedStake.label}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Amount:</span>
                <span className="text-white font-semibold">{selectedStake.amount} HC</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Duration:</span>
                <span className="text-blue-400 font-semibold">{selectedStake.days} days</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/70">APY:</span>
                <span className="text-green-400 font-bold text-xl">{selectedStake.apy}%</span>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-sm">
                  ⚠️ <strong>Important:</strong> Your {selectedStake.amount} HC will be locked for {selectedStake.days} days. Early withdrawal may incur penalties.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={() => setShowStakeConfirm(false)}
                className="flex-1 py-3 px-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmStake}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🚀 Start Staking
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
}
