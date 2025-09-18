// Happy Paisa Netlify Auth Integration
// Complete integration with Netlify Identity and Supabase backend

(function() {
    'use strict';
    
    class HappyPaisaNetlify {
        constructor() {
            this.netlifyAuth = null;
            this.supabase = null;
            this.currentUser = null;
            this.isInitialized = false;
        }
        
        async init() {
            // Wait for Netlify Identity to load
            while (!window.netlifyIdentity) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Wait for Supabase to load
            while (!window.HAPPY_PAISA_SUPABASE) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            this.netlifyAuth = window.netlifyIdentity;
            this.supabase = window.HAPPY_PAISA_SUPABASE;
            
            // Initialize Netlify Identity
            this.netlifyAuth.init();
            
            // Check if user is already logged in
            this.currentUser = this.netlifyAuth.currentUser();
            
            if (this.currentUser) {
                await this.syncUserToSupabase(this.currentUser);
            }
            
            // Set up auth event listeners
            this.setupAuthListeners();
            
            // Initialize UI integration
            this.setupUIIntegration();
            
            this.isInitialized = true;
            console.log('✅ Happy Paisa Netlify Integration loaded');
        }
        
        setupAuthListeners() {
            // Listen for login events
            this.netlifyAuth.on('login', async (user) => {
                console.log('User logged in:', user.email);
                this.currentUser = user;
                await this.syncUserToSupabase(user);
                this.updateUIForUser(user);
                this.showMessage('Welcome back! Signed in successfully.', 'success');
            });
            
            // Listen for signup events
            this.netlifyAuth.on('signup', async (user) => {
                console.log('User signed up:', user.email);
                this.currentUser = user;
                await this.syncUserToSupabase(user, true); // isNewUser = true
                this.updateUIForUser(user);
                this.showMessage('Account created! Welcome to Happy Paisa!', 'success');
            });
            
            // Listen for logout events
            this.netlifyAuth.on('logout', () => {
                console.log('User logged out');
                this.currentUser = null;
                this.updateUIForUser(null);
                this.showMessage('Signed out successfully', 'info');
            });
        }
        
        async syncUserToSupabase(netlifyUser, isNewUser = false) {
            try {
                // Check if user exists in Supabase
                const { data: existingProfile } = await this.supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('email', netlifyUser.email)
                    .single();
                
                if (!existingProfile) {
                    // Create new user profile in Supabase
                    const newProfile = {
                        id: netlifyUser.id,
                        email: netlifyUser.email,
                        full_name: netlifyUser.user_metadata?.full_name || netlifyUser.email.split('@')[0],
                        phone: netlifyUser.user_metadata?.phone || '',
                        main_balance: isNewUser ? 1000.00 : 0, // Welcome bonus for new users
                        happy_coins: isNewUser ? 100 : 0, // Welcome HP points
                        cashback_balance: 0,
                        referral_code: this.generateReferralCode(),
                        created_at: new Date().toISOString()
                    };
                    
                    const { error: profileError } = await this.supabase
                        .from('user_profiles')
                        .insert([newProfile]);
                    
                    if (profileError) {
                        console.error('Profile creation error:', profileError);
                        return;
                    }
                    
                    // Record welcome bonus transaction for new users
                    if (isNewUser) {
                        await this.recordTransaction(netlifyUser.id, 'credit', 1000, 'welcome_bonus', 'Welcome bonus');
                        await this.recordHPTransaction(netlifyUser.id, 100, 'welcome_bonus', 'Welcome Happy Paisa points');
                        
                        // Create welcome notification
                        await this.createNotification(
                            netlifyUser.id,
                            'Welcome to Happy Paisa! 🎉',
                            'Your account has been created successfully. You received ₹1000 welcome bonus and 100 Happy Paisa points!'
                        );
                    }
                    
                    console.log('✅ User profile created in Supabase');
                } else {
                    console.log('✅ User profile already exists in Supabase');
                }
            } catch (error) {
                console.error('User sync error:', error);
            }
        }
        
        setupUIIntegration() {
            // Integrate login/signup buttons
            this.setupAuthButtons();
            
            // Integrate game buttons
            this.setupGameButtons();
            
            // Setup balance updates
            this.setupBalanceUpdates();
            
            // Update UI immediately if user is logged in
            if (this.currentUser) {
                this.updateUIForUser(this.currentUser);
            }
            
            console.log('✅ Netlify UI integration complete');
        }
        
        setupAuthButtons() {
            // Find and integrate login buttons
            const loginButtons = document.querySelectorAll(
                'button[onclick*="login"], .login-btn, #loginBtn, [data-auth="login"]'
            );
            
            loginButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.netlifyAuth.open('login');
                });
            });
            
            // Find and integrate signup buttons
            const signupButtons = document.querySelectorAll(
                'button[onclick*="signup"], button[onclick*="register"], .signup-btn, #signupBtn, [data-auth="signup"]'
            );
            
            signupButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.netlifyAuth.open('signup');
                });
            });
            
            // Find and integrate logout buttons
            const logoutButtons = document.querySelectorAll(
                'button[onclick*="logout"], .logout-btn, #logoutBtn, [data-auth="logout"]'
            );
            
            logoutButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.netlifyAuth.logout();
                });
            });
        }
        
        setupGameButtons() {
            const gameButtons = [
                { selector: 'button[onclick*="clicker"]', gameType: 'clicker', reward: 50 },
                { selector: 'button[onclick*="spinner"]', gameType: 'spinner', reward: 100 },
                { selector: 'button[onclick*="puzzle"]', gameType: 'puzzle', reward: 75 },
                { selector: 'button[onclick*="memory"]', gameType: 'memory', reward: 80 },
                { selector: 'button[onclick*="word"]', gameType: 'word', reward: 60 },
                { selector: '.game-btn, [data-game]', gameType: 'generic', reward: 50 }
            ];
            
            gameButtons.forEach(({ selector, gameType, reward }) => {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(button => {
                    button.addEventListener('click', async (e) => {
                        if (this.isAuthenticated()) {
                            await this.playGame(gameType, reward);
                        } else {
                            this.showMessage('Please sign in to play games and earn rewards!', 'error');
                            // Optionally auto-open login modal
                            setTimeout(() => {
                                this.netlifyAuth.open('login');
                            }, 1000);
                        }
                    });
                });
            });
        }
        
        setupBalanceUpdates() {
            // Update balances every 30 seconds if user is logged in
            setInterval(() => {
                if (this.isAuthenticated()) {
                    this.updateBalanceDisplays();
                }
            }, 30000);
        }
        
        async playGame(gameType, baseReward) {
            if (!this.isAuthenticated()) {
                this.showMessage('Please sign in to play games!', 'error');
                return;
            }
            
            try {
                const user = this.currentUser;
                const reward = this.calculateGameReward(baseReward);
                const score = Math.floor(Math.random() * 1000) + 100;
                
                // Record game score
                const { error } = await this.supabase
                    .from('game_scores')
                    .insert({
                        user_id: user.id,
                        game_type: gameType,
                        score: score,
                        coins_earned: reward,
                        duration: Math.floor(Math.random() * 300) + 30
                    });
                
                if (error) throw error;
                
                // Update user's happy coins
                await this.updateUserCoins(user.id, reward);
                
                // Create notification
                await this.createNotification(
                    user.id,
                    `Game Completed! 🎮`,
                    `You earned ${reward} Happy Paisa points playing ${gameType}! Score: ${score}`
                );
                
                // Show success message
                this.showMessage(`🎮 Great! Earned ${reward} HP points! Score: ${score}`, 'success');
                
                // Update balance displays
                await this.updateBalanceDisplays();
                
            } catch (error) {
                console.error('Game play error:', error);
                this.showMessage('Game error. Please try again.', 'error');
            }
        }
        
        calculateGameReward(baseReward) {
            const bonusMultiplier = Math.random() > 0.7 ? 2 : 1; // 30% chance of double reward
            const randomBonus = Math.floor(Math.random() * 20); // 0-20 bonus points
            return (baseReward * bonusMultiplier) + randomBonus;
        }
        
        async updateUserCoins(userId, coinsToAdd) {
            try {
                const { data: profile } = await this.supabase
                    .from('user_profiles')
                    .select('happy_coins')
                    .eq('id', userId)
                    .single();
                
                const currentCoins = profile?.happy_coins || 0;
                const newTotal = currentCoins + coinsToAdd;
                
                await this.supabase
                    .from('user_profiles')
                    .update({ happy_coins: newTotal })
                    .eq('id', userId);
                
            } catch (error) {
                console.error('Coin update error:', error);
            }
        }
        
        async updateBalanceDisplays() {
            if (!this.isAuthenticated()) return;
            
            try {
                const user = this.currentUser;
                const { data: profile } = await this.supabase
                    .from('user_profiles')
                    .select('main_balance, happy_coins, cashback_balance')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    // Update main balance displays
                    const balanceSelectors = [
                        '#balance', '.balance', '[data-balance="main"]', 
                        '#main-balance', '.main-balance'
                    ];
                    balanceSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            el.textContent = `₹${profile.main_balance || 0}`;
                        });
                    });
                    
                    // Update Happy Paisa points displays
                    const hpSelectors = [
                        '#happy-coins', '.happy-coins', '[data-balance="hp"]',
                        '#hp-points', '.hp-points'
                    ];
                    hpSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            el.textContent = `${profile.happy_coins || 0} HP`;
                        });
                    });
                    
                    // Update cashback balance displays
                    const cashbackSelectors = [
                        '#cashback', '.cashback', '[data-balance="cashback"]'
                    ];
                    cashbackSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            el.textContent = `₹${profile.cashback_balance || 0}`;
                        });
                    });
                }
            } catch (error) {
                console.error('Balance update error:', error);
            }
        }
        
        updateUIForUser(user) {
            // Update user name displays
            const nameElements = document.querySelectorAll(
                '.user-name, #user-name, [data-user="name"]'
            );
            nameElements.forEach(el => {
                el.textContent = user ? (user.user_metadata?.full_name || user.email.split('@')[0]) : '';
            });
            
            // Update user email displays
            const emailElements = document.querySelectorAll(
                '.user-email, #user-email, [data-user="email"]'
            );
            emailElements.forEach(el => {
                el.textContent = user ? user.email : '';
            });
            
            // Show/hide elements based on auth state
            const authElements = document.querySelectorAll('[data-auth-show]');
            authElements.forEach(el => {
                const showWhen = el.getAttribute('data-auth-show');
                if (showWhen === 'authenticated' && user) {
                    el.style.display = '';
                } else if (showWhen === 'unauthenticated' && !user) {
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            });
            
            // Update balances if user is logged in
            if (user) {
                this.updateBalanceDisplays();
            } else {
                // Clear balances when logged out
                const clearSelectors = [
                    '#balance', '.balance', '#happy-coins', '.happy-coins', 
                    '#cashback', '.cashback'
                ];
                clearSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.textContent = '₹0';
                    });
                });
            }
        }
        
        async recordTransaction(userId, type, amount, transactionType, description) {
            try {
                await this.supabase
                    .from('wallet_transactions')
                    .insert({
                        user_id: userId,
                        type,
                        amount,
                        transaction_type: transactionType,
                        description,
                        status: 'completed'
                    });
            } catch (error) {
                console.error('Transaction recording error:', error);
            }
        }
        
        async recordHPTransaction(userId, points, type, description) {
            try {
                await this.supabase
                    .from('game_scores')
                    .insert({
                        user_id: userId,
                        game_type: type,
                        score: 0,
                        coins_earned: points,
                        duration: 0
                    });
            } catch (error) {
                console.error('HP transaction recording error:', error);
            }
        }
        
        async createNotification(userId, title, message, type = 'info') {
            try {
                await this.supabase
                    .from('notifications')
                    .insert({
                        user_id: userId,
                        title,
                        message,
                        type
                    });
            } catch (error) {
                console.error('Notification creation error:', error);
            }
        }
        
        generateReferralCode() {
            return 'HP' + Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        
        // Utility methods
        isAuthenticated() {
            return !!this.currentUser;
        }
        
        getCurrentUser() {
            return this.currentUser;
        }
        
        showMessage(message, type = 'info') {
            const colors = {
                success: '#28a745',
                error: '#dc3545',
                info: '#17a2b8'
            };
            
            const el = document.createElement('div');
            el.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 9999;
                color: white;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                max-width: 300px;
                word-wrap: break-word;
                background: ${colors[type] || colors.info};
            `;
            el.textContent = message;
            
            document.body.appendChild(el);
            
            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 5000);
            
            el.onclick = () => {
                if (el.parentNode) el.parentNode.removeChild(el);
            };
        }
        
        // API Services
        get services() {
            return {
                getMobileOperators: async () => {
                    try {
                        const { data } = await this.supabase
                            .from('mobile_operators')
                            .select('*')
                            .eq('is_active', true)
                            .order('name');
                        return data || [];
                    } catch (error) {
                        console.error('Mobile operators fetch error:', error);
                        return [];
                    }
                },
                
                getDashboardData: async () => {
                    if (!this.isAuthenticated()) return null;
                    
                    try {
                        const user = this.currentUser;
                        
                        const { data: profile } = await this.supabase
                            .from('user_profiles')
                            .select('*')
                            .eq('id', user.id)
                            .single();
                        
                        const { data: recentGames } = await this.supabase
                            .from('game_scores')
                            .select('*')
                            .eq('user_id', user.id)
                            .order('created_at', { ascending: false })
                            .limit(5);
                        
                        const { data: notifications } = await this.supabase
                            .from('notifications')
                            .select('*')
                            .eq('user_id', user.id)
                            .eq('is_read', false)
                            .order('created_at', { ascending: false })
                            .limit(5);
                        
                        return {
                            profile,
                            recentGames: recentGames || [],
                            notifications: notifications || []
                        };
                    } catch (error) {
                        console.error('Dashboard data fetch error:', error);
                        return null;
                    }
                },
                
                getNotifications: async (limit = 10) => {
                    if (!this.isAuthenticated()) return [];
                    
                    try {
                        const user = this.currentUser;
                        const { data } = await this.supabase
                            .from('notifications')
                            .select('*')
                            .eq('user_id', user.id)
                            .order('created_at', { ascending: false })
                            .limit(limit);
                        
                        return data || [];
                    } catch (error) {
                        console.error('Notifications fetch error:', error);
                        return [];
                    }
                }
            };
        }
    }
    
    // Initialize and expose Happy Paisa Netlify integration
    window.HappyPaisaNetlify = new HappyPaisaNetlify();
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.HappyPaisaNetlify.init();
        });
    } else {
        window.HappyPaisaNetlify.init();
    }
    
})();