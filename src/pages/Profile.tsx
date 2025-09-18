import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Upload,
  Trash2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { httpSupabaseAPI, WalletTransaction, P2POffer, Booking } from '../services/httpSupabaseAPI';

interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  website?: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  avatar?: string
  dateJoined: string
  socialLinks: SocialLinks
}

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const { isAuthenticated, user, profile: authProfile, updateProfile } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    dateJoined: '',
    socialLinks: {}
  })

  const [editForm, setEditForm] = useState<UserProfile>(profile)
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Happy emoji avatars collection
  const emojiAvatars = [
    '😊', '😄', '😁', '🤗', '😆', '🥳', '😎', '🤩',
    '😇', '🙂', '😃', '😀', '🤪', '🤓', '🥰', '😍',
    '🤑', '🤠', '👑', '🎉', '🌟', '💎', '🏆', '🎯',
    '🚀', '💪', '🔥', '⭐', '✨', '🎊', '🎈', '🌈'
  ]

  // Load profile data on mount and when auth changes
  useEffect(() => {
    loadProfileData()
  }, [isAuthenticated, authProfile, user])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated && user && authProfile) {
        httpSupabaseAPI.getWalletTransactions(user.id).then(setTransactions);
        httpSupabaseAPI.getP2POffers().then(setOffers);
        httpSupabaseAPI.getBookings(user.id).then(setBookings);
        
        // Use real Supabase profile data
        const userProfile: UserProfile = {
          id: authProfile.id,
          name: authProfile.username,
          email: authProfile.email,
          phone: '',
          location: '',
          bio: '',
          avatar: authProfile.avatar_url || '',
          dateJoined: authProfile.created_at,
          socialLinks: {}
        }
        
        setProfile(userProfile)
        setEditForm(userProfile)
      } else {
        // User is not authenticated - this shouldn't happen with proper route guards
        console.error('Profile page accessed without authentication')
        // Clear profile state
        setProfile({
          id: '',
          name: '',
          email: '',
          phone: '',
          location: '',
          bio: '',
          avatar: '',
          dateJoined: '',
          socialLinks: {}
        })
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
      // If there's an error, clear the profile state
      setProfile({
        id: '',
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: '',
        dateJoined: '',
        socialLinks: {}
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      if (!user?.id) {
        alert('Please sign in to upload profile image')
        return
      }

      console.log('Uploading profile image...')
      
      // Upload image and get the URL
      const imageUrl = await httpSupabaseAPI.uploadProfileImage(user.id, file)
      
      // Save to database immediately
      const updatedProfile = await httpSupabaseAPI.updateUserProfile(user.id, {
        avatar_url: imageUrl
      })
      
      // Update local state
      const localProfile = {
        ...profile,
        avatar: updatedProfile.avatar_url || imageUrl
      }
      setProfile(localProfile)
      setEditForm(localProfile)
      
      console.log('Profile image updated and saved successfully')
      alert('Profile image updated successfully!')
      
    } catch (error: any) {
      console.error('Error uploading image:', error)
      console.error('Upload error details:', {
        message: error.message,
        stack: error.stack
      })
      alert(`Failed to upload image: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleEmojiSelect = async (emoji: string) => {
    if (!user?.id) {
      alert('Please sign in to select emoji avatar')
      return
    }

    try {
      setUploading(true)
      console.log('Setting emoji avatar:', emoji)
      
      // Create a data URL for the emoji (we'll store the emoji directly)
      const emojiUrl = `emoji:${emoji}`
      
      // Save to database immediately
      const updatedProfile = await httpSupabaseAPI.updateUserProfile(user.id, {
        avatar_url: emojiUrl
      })
      
      // Update local state
      const localProfile = {
        ...profile,
        avatar: updatedProfile.avatar_url || emojiUrl
      }
      setProfile(localProfile)
      setEditForm(localProfile)
      setShowEmojiPicker(false)
      
      console.log('Emoji avatar updated successfully')
      alert('Emoji avatar updated successfully! 🎉')
      
    } catch (error: any) {
      console.error('Error setting emoji avatar:', error)
      console.error('Emoji avatar error details:', {
        message: error.message,
        stack: error.stack
      })
      alert(`Failed to set emoji avatar: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!user?.id) {
      alert('Please sign in to remove profile image')
      return
    }

    try {
      setUploading(true)
      
      // Remove from database
      const updatedProfile = await httpSupabaseAPI.updateUserProfile(user.id, {
        avatar_url: undefined
      })
      
      // Update local state
      const localProfile = { ...profile, avatar: '' }
      setProfile(localProfile)
      setEditForm(localProfile)
      
      console.log('Profile image removed successfully')
      alert('Profile image removed successfully!')
      
    } catch (error: any) {
      console.error('Error removing image:', error)
      console.error('Remove image error details:', {
        message: error.message,
        stack: error.stack
      })
      alert(`Failed to remove image: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      if (isAuthenticated && authProfile) {
        // Update profile via Supabase API
        const updatedProfile = await updateProfile({
          username: editForm.name,
          email: editForm.email,
          avatar_url: editForm.avatar
        })
        
        // Update local state with API response
        const localProfile = {
          ...editForm,
          id: updatedProfile.id,
          name: updatedProfile.username,
          email: updatedProfile.email,
          avatar: updatedProfile.avatar_url || editForm.avatar
        }
        
        setProfile(localProfile)
        setEditForm(localProfile)
        setIsEditing(false)
        
        console.log('Profile updated successfully via Supabase')
        alert('Profile updated successfully!')
        
      } else {
        // User is not authenticated - this shouldn't happen
        console.error('Attempted to save profile without authentication')
        alert('Error: You must be signed in to update your profile.')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { key: 'website', label: 'Website', icon: Globe, color: 'text-green-500' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white/70 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: saving ? 1 : 1.05 }}
                whileTap={{ scale: saving ? 1 : 0.95 }}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Profile Picture Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              {profile.avatar ? (
                profile.avatar.startsWith('emoji:') ? (
                  <div className="text-6xl">
                    {profile.avatar.replace('emoji:', '')}
                  </div>
                ) : (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            {isEditing && (
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{profile.name}</h3>
            <p className="text-white/70 mb-4">Member since {new Date(profile.dateJoined).toLocaleDateString()}</p>
            {isEditing && (
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">😊</span>
                  <span>Emoji Avatar</span>
                </motion.button>
                {profile.avatar && (
                  <motion.button
                    onClick={handleRemoveImage}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        {/* Emoji Avatar Picker */}
        <AnimatePresence>
          {isEditing && showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
            >
            <h3 className="text-lg font-medium text-white mb-3">Choose an Emoji Avatar</h3>
            <div className="grid grid-cols-8 gap-3">
              {emojiAvatars.map((emoji, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-2xl transition-colors border border-white/20 hover:border-white/40"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={uploading}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
            <p className="text-white/60 text-sm mt-3 text-center">
              Click any emoji to set it as your profile picture! 🎆
            </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              />
            ) : (
              <p className="px-4 py-3 text-white bg-white/5 rounded-lg">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              />
            ) : (
              <p className="px-4 py-3 text-white bg-white/5 rounded-lg">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="px-4 py-3 text-white bg-white/5 rounded-lg">{profile.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.location || ''}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="Enter your location"
              />
            ) : (
              <p className="px-4 py-3 text-white bg-white/5 rounded-lg">{profile.location || 'Not provided'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Edit3 className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio || ''}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="px-4 py-3 text-white bg-white/5 rounded-lg min-h-[100px]">{profile.bio || 'No bio provided'}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Social Media Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map(({ key, label, icon: Icon, color }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Icon className={`w-4 h-4 inline mr-2 ${color}`} />
                {label}
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={editForm.socialLinks[key as keyof SocialLinks] || ''}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    socialLinks: {
                      ...editForm.socialLinks,
                      [key]: e.target.value
                    }
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder={`Enter your ${label.toLowerCase()} URL`}
                />
              ) : (
                <div className="px-4 py-3 bg-white/5 rounded-lg">
                  {profile.socialLinks[key as keyof SocialLinks] ? (
                    <a 
                      href={profile.socialLinks[key as keyof SocialLinks]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {profile.socialLinks[key as keyof SocialLinks]}
                    </a>
                  ) : (
                    <span className="text-white/50">Not connected</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Account Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {authProfile?.total_earned?.toLocaleString() || '15,420'}
            </div>
            <div className="text-white/70">Total HP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {authProfile?.games_played || '47'}
            </div>
            <div className="text-white/70">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {authProfile?.created_at ? Math.floor((Date.now() - new Date(authProfile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : '12'}
            </div>
            <div className="text-white/70">Days Active</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}