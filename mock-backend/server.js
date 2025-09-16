const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/leaderboard/updates' });

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let leaderboardData = [
  {
    id: '1',
    username: 'GamerPro2024',
    avatar: '',
    totalScore: 15420,
    totalEarnings: 8750,
    gamesPlayed: 47,
    bestGame: 'Snake Game',
    bestScore: 340,
    rank: 1,
    rankChange: 'up',
    isCurrentUser: false,
    achievements: ['high_scorer', 'game_master'],
    lastActive: Date.now() - 3600000,
    streakCount: 7,
    winRate: 85,
    averageScore: 328,
    level: 12,
    experience: 2450
  },
  {
    id: '2',
    username: 'MathWizard',
    avatar: '',
    totalScore: 14890,
    totalEarnings: 8200,
    gamesPlayed: 52,
    bestGame: 'Math Quiz',
    bestScore: 195,
    rank: 2,
    rankChange: 'down',
    isCurrentUser: false,
    achievements: ['math_genius', 'speed_demon'],
    lastActive: Date.now() - 1800000,
    streakCount: 5,
    winRate: 78,
    averageScore: 286,
    level: 11,
    experience: 2100
  },
  {
    id: '3',
    username: 'MemoryMaster',
    avatar: '',
    totalScore: 13650,
    totalEarnings: 7800,
    gamesPlayed: 38,
    bestGame: 'Memory Match',
    bestScore: 280,
    rank: 3,
    rankChange: 'same',
    isCurrentUser: false,
    achievements: ['memory_master', 'consistent_player'],
    lastActive: Date.now() - 7200000,
    streakCount: 3,
    winRate: 92,
    averageScore: 359,
    level: 10,
    experience: 1850
  },
  {
    id: '4',
    username: 'You',
    avatar: '',
    totalScore: 11850,
    totalEarnings: 6500,
    gamesPlayed: 28,
    bestGame: 'Word Puzzle',
    bestScore: 165,
    rank: 4,
    rankChange: 'new',
    isCurrentUser: true,
    achievements: ['newcomer', 'word_wizard'],
    lastActive: Date.now(),
    streakCount: 2,
    winRate: 71,
    averageScore: 423,
    level: 8,
    experience: 1200
  }
];

let analytics = {
  timeframe: 'weekly',
  totalUsers: 1247,
  totalGames: 8945,
  totalRewardsAwarded: 125000,
  averageScore: 287,
  mostPopularGame: 'Snake Game',
  topScorer: {
    username: 'GamerPro2024',
    score: 15420
  },
  gameDistribution: {
    clicker: 25,
    memory: 20,
    math: 18,
    snake: 22,
    word: 15
  },
  userEngagement: {
    dailyActiveUsers: 342,
    averageSessionTime: 480,
    retentionRate: 78
  },
  trends: [
    { date: '2024-01-08', activeUsers: 320, gamesPlayed: 890, rewardsEarned: 12500 },
    { date: '2024-01-09', activeUsers: 335, gamesPlayed: 920, rewardsEarned: 13200 },
    { date: '2024-01-10', activeUsers: 342, gamesPlayed: 945, rewardsEarned: 13800 }
  ]
};

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  clients.add(ws);
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'leaderboard_update',
    payload: leaderboardData,
    timestamp: Date.now()
  }));
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected from WebSocket');
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock backend is running!' });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const { timeframe = 'weekly', game = 'all', limit = 50 } = req.query;
  
  console.log(`Leaderboard request: timeframe=${timeframe}, game=${game}, limit=${limit}`);
  
  let filteredData = [...leaderboardData];
  
  // Apply filters (mock logic)
  if (game !== 'all') {
    filteredData = filteredData.filter(user => 
      user.bestGame.toLowerCase().includes(game) || game === 'clicker' && user.bestGame === 'Happy Clicker'
    );
  }
  
  res.json(filteredData.slice(0, parseInt(limit)));
});

// Get current user stats
app.get('/api/leaderboard/me', (req, res) => {
  const currentUser = leaderboardData.find(user => user.isCurrentUser);
  if (currentUser) {
    // Transform to UserStatsSummary format
    const userStats = {
      userId: currentUser.id,
      username: currentUser.username,
      overallRank: currentUser.rank,
      gameStats: {
        'clicker': {
          gamesPlayed: 8,
          bestScore: 156,
          averageScore: 134,
          totalEarnings: 1200,
          winRate: 75,
          personalBest: { score: 156, achievedAt: Date.now() - 86400000 }
        },
        'word': {
          gamesPlayed: 12,
          bestScore: 165,
          averageScore: 142,
          totalEarnings: 2100,
          winRate: 83,
          personalBest: { score: 165, achievedAt: Date.now() - 3600000 }
        },
        'memory': {
          gamesPlayed: 8,
          bestScore: 124,
          averageScore: 108,
          totalEarnings: 950,
          winRate: 62,
          personalBest: { score: 124, achievedAt: Date.now() - 7200000 }
        }
      },
      achievements: [
        {
          achievementId: 'first_win',
          userId: currentUser.id,
          unlockedAt: Date.now() - 86400000,
          progress: 100,
          maxProgress: 100,
          claimed: true
        },
        {
          achievementId: 'word_wizard',
          userId: currentUser.id,
          unlockedAt: Date.now() - 3600000,
          progress: 100,
          maxProgress: 100,
          claimed: false
        }
      ],
      currentStreak: currentUser.streakCount,
      longestStreak: 7,
      totalPlayTime: 3600, // 1 hour
      joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      lastActiveAt: currentUser.lastActive
    };
    res.json(userStats);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get user by ID
app.get('/api/leaderboard/user/:userId', (req, res) => {
  const user = leaderboardData.find(u => u.id === req.params.userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update user stats
app.post('/api/leaderboard/stats', (req, res) => {
  const { userId, gameType, score, duration } = req.body;
  console.log(`Stats update: User ${userId}, Game: ${gameType}, Score: ${score}`);
  
  // Mock update logic
  const user = leaderboardData.find(u => u.id === userId);
  if (user) {
    user.totalScore += score;
    user.gamesPlayed += 1;
    if (score > user.bestScore) {
      user.bestScore = score;
      user.bestGame = gameType;
    }
    user.lastActive = Date.now();
    
    // Broadcast update
    broadcast({
      type: 'user_score_update',
      payload: { userId, newScore: user.totalScore, gameType, score },
      timestamp: Date.now()
    });
  }
  
  res.json({ success: true, message: 'Stats updated' });
});

// Award bonuses
app.post('/api/leaderboard/award-bonuses', (req, res) => {
  const { timeframe } = req.body;
  console.log(`Awarding bonuses for timeframe: ${timeframe}`);
  
  const bonuses = [
    { rank: 1, amount: 1000 },
    { rank: 2, amount: 500 },
    { rank: 3, amount: 250 }
  ];
  
  const rewards = leaderboardData.slice(0, 3).map((user, index) => ({
    id: `bonus_${Date.now()}_${index}`,
    userId: user.id,
    username: user.username,
    rank: user.rank,
    amount: bonuses[index].amount,
    timeframe,
    awardedAt: Date.now(),
    type: 'ranking',
    description: `${timeframe} leaderboard bonus`
  }));
  
  // Update user earnings
  rewards.forEach(reward => {
    const user = leaderboardData.find(u => u.id === reward.userId);
    if (user) {
      user.totalEarnings += reward.amount;
    }
  });
  
  // Broadcast bonus awards
  broadcast({
    type: 'bonus_awarded',
    payload: rewards,
    timestamp: Date.now()
  });
  
  res.json(rewards);
});

// Get analytics
app.get('/api/leaderboard/analytics', (req, res) => {
  const { timeframe = 'weekly' } = req.query;
  console.log(`Analytics request for timeframe: ${timeframe}`);
  res.json({ ...analytics, timeframe });
});

// Reset leaderboard (admin only)
app.post('/api/leaderboard/reset', (req, res) => {
  const { timeframe } = req.body;
  console.log(`Resetting ${timeframe} leaderboard`);
  
  // Mock reset logic
  leaderboardData.forEach(user => {
    if (timeframe === 'daily') {
      // Reset daily stats only
      user.gamesPlayed = Math.max(0, user.gamesPlayed - 5);
    } else if (timeframe === 'weekly') {
      // Reset weekly stats
      user.totalScore = Math.floor(user.totalScore * 0.7);
      user.gamesPlayed = Math.max(0, user.gamesPlayed - 10);
    }
  });
  
  // Re-rank users
  leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
  leaderboardData.forEach((user, index) => {
    user.rank = index + 1;
  });
  
  broadcast({
    type: 'leaderboard_update',
    payload: leaderboardData,
    timestamp: Date.now()
  });
  
  res.json({ success: true, message: `${timeframe} leaderboard reset` });
});

// Get achievements
app.get('/api/achievements/:userId', (req, res) => {
  const mockAchievements = [
    {
      achievementId: 'first_win',
      userId: req.params.userId,
      unlockedAt: Date.now() - 86400000,
      progress: 100,
      maxProgress: 100,
      claimed: true
    },
    {
      achievementId: 'high_scorer',
      userId: req.params.userId,
      unlockedAt: 0,
      progress: 75,
      maxProgress: 100,
      claimed: false
    },
    {
      achievementId: 'math_genius',
      userId: req.params.userId,
      unlockedAt: Date.now() - 3600000,
      progress: 100,
      maxProgress: 100,
      claimed: false
    }
  ];
  res.json(mockAchievements);
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}/leaderboard/updates`);
  console.log(`🎯 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/leaderboard`);
  console.log(`  GET  /api/leaderboard/me`);
  console.log(`  POST /api/leaderboard/stats`);
  console.log(`  POST /api/leaderboard/award-bonuses`);
  console.log(`  GET  /api/leaderboard/analytics`);
  console.log(`  POST /api/leaderboard/reset`);
  console.log(`  GET  /api/achievements/:userId`);
});

// Simulate real-time updates every 30 seconds
setInterval(() => {
  // Randomly update a user's score
  const randomUser = leaderboardData[Math.floor(Math.random() * leaderboardData.length)];
  const scoreIncrease = Math.floor(Math.random() * 100) + 50;
  
  randomUser.totalScore += scoreIncrease;
  randomUser.gamesPlayed += 1;
  randomUser.lastActive = Date.now();
  
  // Re-sort and update ranks
  leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
  leaderboardData.forEach((user, index) => {
    const oldRank = user.rank;
    user.rank = index + 1;
    if (oldRank !== user.rank) {
      user.rankChange = oldRank > user.rank ? 'up' : 'down';
    }
  });
  
  console.log(`🎮 Auto-update: ${randomUser.username} scored ${scoreIncrease} points!`);
  
  // Broadcast the update
  broadcast({
    type: 'leaderboard_update',
    payload: leaderboardData,
    timestamp: Date.now()
  });
}, 30000); // Every 30 seconds