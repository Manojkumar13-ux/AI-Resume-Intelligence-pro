import User from '../models/User.js';
import Resume from '../models/Resume.js';

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const proUsers = await User.countDocuments({ isPro: true });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    const avgScoreResult = await Resume.aggregate([
      { $group: { _id: null, avg: { $avg: '$atsScore' } } }
    ]);
    const avgScore = avgScoreResult[0]?.avg || 0;

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt isPro');

    // Recent resumes
    const recentResumes = await Resume.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        proUsers,
        verifiedUsers,
        avgScore: Math.round(avgScore),
      },
      recentUsers,
      recentResumes,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};