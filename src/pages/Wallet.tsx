import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Coins, PiggyBank, ArrowUpRight, ArrowDownRight, Gift, RotateCcw, ShoppingCart, TrendingUp, Wallet as WalletIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { httpSupabaseAPI, WalletTransaction, WalletBalances } from '../services/httpSupabaseAPI'

function BalanceCard({ icon: Icon, title, amount, subtext, colorClass }: { icon: any; title: string; amount: number; subtext: string; colorClass: string }) {
  return (
    <div className={`card flex-1 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <h2 className="text-3xl font-bold">{amount.toLocaleString()}</h2>
          <p className="text-sm font-semibold text-muted">{subtext}</p>
        </div>
        <Icon size={48} className="opacity-20" />
      </div>
    </div>
  )
}

function ActionCard({ icon: Icon, title, description, children }: { icon: any; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <Icon size={32} className="text-brand" />
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><WalletIcon />My Wallet</h1>
        <motion.button
          onClick={loadWalletData}
          className="btn btn-secondary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={16} />
          Refresh
        </motion.button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BalanceCard icon={ShoppingCart} title="Happy Coins (HC)" amount={balances.happyCoins} subtext="Purchased" colorClass="" />
        <BalanceCard icon={Coins} title="Happy Paisa" amount={balances.happyPaisa} subtext="From Games" colorClass="" />
        <BalanceCard icon={PiggyBank} title="Staked Amount" amount={balances.stakedAmount} subtext="Locked" colorClass="" />
        <BalanceCard icon={TrendingUp} title="Total Earned" amount={balances.totalEarned} subtext="Lifetime" colorClass="" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buy Coins and Staking Section */}
        <ActionCard icon={ShoppingCart} title="Buy Happy Coins" description="Purchase HC with real money via Stripe">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-muted">Currency:</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="input text-sm"
            >
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="INR">🇮🇳 INR</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { hc: 10, priceUSD: 9.99, label: 'Basic' },
              { hc: 25, priceUSD: 19.99, label: 'Popular' },
              { hc: 50, priceUSD: 34.99, label: 'Premium' },
            ].map((pkg, i) => {
              const convertedPrice = convertPrice(pkg.priceUSD, selectedCurrency);
              const formattedPrice = formatPrice(convertedPrice, selectedCurrency);
              return (
                <motion.div
                  key={i}
                  className="card flex items-center justify-between cursor-pointer"
                  onClick={() => handleBuyCoins(pkg.hc, pkg.priceUSD, pkg.label)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <div className="font-bold">{pkg.hc} HC</div>
                    <div className="text-sm text-muted">{pkg.label}</div>
                  </div>
                  <div className="font-bold text-lg text-brand">{formattedPrice}</div>
                </motion.div>
              )
            })}
          </div>
        </ActionCard>

        <ActionCard icon={PiggyBank} title="Stake Happy Coins" description="Earn rewards by staking your HC">
          <div className="grid grid-cols-1 gap-4">
            {[
              { days: 7, apy: 5, minStake: 10, label: 'Short Term' },
              { days: 30, apy: 8, minStake: 25, label: 'Medium Term' },
              { days: 90, apy: 12, minStake: 50, label: 'Long Term' },
            ].map((option, i) => (
              <motion.div
                key={i}
                className="card flex items-center justify-between cursor-pointer"
                onClick={() => handleStake(option.minStake, option.days, option.apy, option.label)}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <div className="font-bold">{option.days} Days</div>
                  <div className="text-sm text-muted">Min. {option.minStake} HC</div>
                </div>
                <div className="font-bold text-lg text-brand">{option.apy}% APY</div>
              </motion.div>
            ))}
          </div>
        </ActionCard>
      </div>

      {/* Convert Paisa to HC Section */}
      <ActionCard icon={RotateCcw} title="Convert Happy Paisa" description="Convert your earned HP to HC (1000 HP = 1 HC)">
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(e.target.value)}
            placeholder="Amount to convert (e.g. 1000)"
            className="input flex-1"
            min="1000"
            max={balances.happyPaisa}
          />
          <button
            onClick={handleConvertPaisaToCoins}
            disabled={loading || !convertAmount || parseInt(convertAmount) < 1000}
            className="btn btn-primary"
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </ActionCard>

      {/* Transaction History */}
      <ActionCard icon={TrendingUp} title="Transaction History" description="Your recent wallet activity">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="card flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted">{new Date(transaction.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className={`font-bold ${transaction.type === 'spent' ? 'text-red-500' : 'text-green-500'}`}>
                  {transaction.type === 'spent' ? '-' : '+'}{transaction.amount} HP
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted">No transactions yet.</p>
          )}
        </div>
      </ActionCard>


    </motion.div>
  );
}
