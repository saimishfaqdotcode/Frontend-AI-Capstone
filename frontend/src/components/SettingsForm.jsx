import { useState } from 'react';

const initialSettings = {
  profile: {
    name: '',
    email: '',
    bio: '',
  },
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    compactMode: false,
  },
};

export default function SettingsForm() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
  ];

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </header>

      {saved && <div className="success-toast">Settings saved successfully!</div>}

      <div className="settings-layout">
        <nav className="settings-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="settings-content">
          <form onSubmit={handleSubmit} noValidate>
            {activeTab === 'profile' && (
              <section className="settings-section" aria-labelledby="profile-heading">
                <h2 id="profile-heading">Profile</h2>
                <div className="field-group">
                  <label htmlFor="name">Display Name</label>
                  <input
                    id="name"
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => handleChange('profile', 'name', e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleChange('profile', 'email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    value={settings.profile.bio}
                    onChange={(e) => handleChange('profile', 'bio', e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </section>
            )}

            {activeTab === 'notifications' && (
              <section className="settings-section" aria-labelledby="notifications-heading">
                <h2 id="notifications-heading">Notifications</h2>
                <div className="field-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <div className="toggle-info">
                      <strong>Email Notifications</strong>
                      <span>Receive updates via email</span>
                    </div>
                  </label>
                </div>
                <div className="field-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <div className="toggle-info">
                      <strong>Push Notifications</strong>
                      <span>Receive browser push notifications</span>
                    </div>
                  </label>
                </div>
                <div className="field-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <div className="toggle-info">
                      <strong>SMS Notifications</strong>
                      <span>Receive text message alerts</span>
                    </div>
                  </label>
                </div>
              </section>
            )}

            {activeTab === 'privacy' && (
              <section className="settings-section" aria-labelledby="privacy-heading">
                <h2 id="privacy-heading">Privacy</h2>
                <div className="field-group">
                  <label htmlFor="profileVisibility">Profile Visibility</label>
                  <select
                    id="profileVisibility"
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleChange('privacy', 'profileVisibility', e.target.value)}
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="friends">Friends Only - Only connected users</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>
                <div className="field-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showEmail}
                      onChange={(e) => handleChange('privacy', 'showEmail', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <div className="toggle-info">
                      <strong>Show Email</strong>
                      <span>Display email on your public profile</span>
                    </div>
                  </label>
                </div>
                <div className="field-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showActivity}
                      onChange={(e) => handleChange('privacy', 'showActivity', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <div className="toggle-info">
                      <strong>Show Activity</strong>
                      <span>Display your recent activity to others</span>
                    </div>
                  </label>
                </div>
              </section>
            )}

            {activeTab === 'appearance' && (
              <section className="settings-section" aria-labelledby="appearance-heading">
                <h2 id="appearance-heading">Appearance</h2>
                <div className="field-group">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={settings.appearance.theme}
                    onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Preference</option>
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="fontSize">Font Size</label>
                  <select
                    id="fontSize"
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleChange('appearance', 'fontSize', e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="field-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactMode}
                      onChange={(e) => handleChange('appearance', 'compactMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <div className="toggle-info">
                      <strong>Compact Mode</strong>
                      <span>Reduce spacing for more content</span>
                    </div>
                  </label>
                </div>
              </section>
            )}

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setSettings(initialSettings)}>
                Reset to Defaults
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}