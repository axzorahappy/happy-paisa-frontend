# 🌐 Custom Domain Setup - Happy Paisa App

## 🎯 **Overview**
Set up your custom domain (e.g., `happypaisa.com`) to point to your live app instead of using `happypaisaapp.netlify.app`.

---

## 🔧 **DNS Settings for Hostinger**

### 📋 **What You'll Need:**
- **Your domain name** (e.g., `happypaisa.com`)
- **Hostinger DNS management access**
- **Netlify site**: `https://app.netlify.com/projects/happypaisaapp`

---

## 🚀 **Step 1: Netlify Domain Configuration**

### **Add Domain in Netlify:**
1. **Open Netlify Admin**: `https://app.netlify.com/projects/happypaisaapp`
2. **Go to "Domain settings"**
3. **Click "Add custom domain"**
4. **Enter your domain**: `happypaisa.com` (replace with your actual domain)
5. **Click "Verify"**

### **Get DNS Target Values:**
After adding the domain, Netlify will show you the DNS records to configure. 

---

## 🌐 **Step 2: Hostinger DNS Configuration**

### **Login to Hostinger:**
1. **Go to**: `https://hpanel.hostinger.com`
2. **Login** with your Hostinger account
3. **Go to "DNS Zone Editor"** or **"Domain settings"**

### **DNS Records to Add/Update:**

#### **Option A: CNAME Method (Recommended)**
```
Type: CNAME
Name: www
Target: happypaisaapp.netlify.app
TTL: 3600 (or Auto)

Type: CNAME  
Name: @
Target: happypaisaapp.netlify.app
TTL: 3600 (or Auto)
```

#### **Option B: A Record Method**
If Hostinger doesn't support CNAME for root domain:
```
Type: A
Name: @
Target: 75.2.60.5
TTL: 3600

Type: CNAME
Name: www  
Target: happypaisaapp.netlify.app
TTL: 3600
```

### **Complete DNS Configuration Example:**
```dns
# Root domain
Type: A
Name: @
Value: 75.2.60.5

# WWW subdomain  
Type: CNAME
Name: www
Value: happypaisaapp.netlify.app

# Optional: API subdomain for future backend
Type: CNAME  
Name: api
Value: happypaisaapp.netlify.app

# Optional: Mobile app deep links
Type: CNAME
Name: m
Value: happypaisaapp.netlify.app
```

---

## ⚡ **Step 3: Netlify Final Configuration**

### **After DNS is Set:**
1. **Return to Netlify** domain settings
2. **Wait for verification** (can take up to 24 hours)
3. **Enable HTTPS** (automatic with Let's Encrypt)
4. **Set primary domain** (choose between `happypaisa.com` vs `www.happypaisa.com`)

### **Expected Results:**
- ✅ `https://happypaisa.com` → Your Happy Paisa App
- ✅ `https://www.happypaisa.com` → Your Happy Paisa App  
- ✅ **SSL Certificate** automatically provisioned
- ✅ **CDN acceleration** worldwide

---

## 🎯 **Alternative DNS Providers Guide**

### **If Using Different DNS Provider:**

#### **Cloudflare:**
```dns
Type: CNAME
Name: @
Target: happypaisaapp.netlify.app
Proxied: Yes (Orange Cloud)

Type: CNAME  
Name: www
Target: happypaisaapp.netlify.app
Proxied: Yes (Orange Cloud)
```

#### **Namecheap:**
```dns
Type: CNAME Record
Host: www
Value: happypaisaapp.netlify.app

Type: A Record
Host: @  
Value: 75.2.60.5
```

#### **GoDaddy:**
```dns
Type: CNAME
Name: www
Value: happypaisaapp.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

---

## 🔍 **Step 4: Verification & Testing**

### **Check DNS Propagation:**
1. **Use DNS Checker**: `https://dnschecker.org`
2. **Enter your domain**: `happypaisa.com`
3. **Check globally**: Ensure DNS has propagated worldwide

### **Test Your Domain:**
```bash
# Command line testing
nslookup happypaisa.com
dig happypaisa.com

# Expected results should point to Netlify
```

### **Browser Testing:**
- **Visit**: `https://happypaisa.com`
- **Should redirect to**: Your Happy Paisa App
- **Check SSL**: Green padlock should appear
- **Mobile test**: Verify responsive design

---

## ⚠️ **Common Issues & Solutions**

### **DNS Not Propagating:**
- **Wait time**: Can take 24-48 hours
- **Clear DNS cache**: `ipconfig /flushdns` (Windows)
- **Try incognito mode**: Avoid browser caching

### **SSL Certificate Issues:**
- **Wait for auto-provision**: Usually takes 10-30 minutes
- **Check in Netlify**: Domain settings should show "Secured"
- **Force HTTPS**: Enable in Netlify settings

### **Redirects Not Working:**
- **Check Netlify redirects**: Should handle www → non-www or vice versa
- **Update primary domain**: Set in Netlify domain settings

---

## 🚀 **Expected Timeline**

### **Immediate (0-5 minutes):**
- ✅ DNS records added in Hostinger
- ✅ Domain added in Netlify

### **Within 30 minutes:**
- ✅ Domain verification complete
- ✅ SSL certificate provisioned
- ✅ HTTPS working

### **Within 24 hours:**
- ✅ Global DNS propagation complete
- ✅ All users can access via custom domain
- ✅ SEO updates begin

---

## 📱 **Mobile App Updates**

### **After Domain is Live:**
Update your mobile app URL in `mobile/App.js`:

```javascript
// Change from:
const WEB_APP_URL = 'https://happypaisaapp.netlify.app';

// To:
const WEB_APP_URL = 'https://happypaisa.com';
```

Then rebuild your mobile apps for consistency.

---

## 🎉 **Success Checklist**

### **Domain Setup Complete When:**
- ✅ `https://happypaisa.com` loads your app
- ✅ `https://www.happypaisa.com` redirects properly  
- ✅ SSL certificate shows green padlock
- ✅ Mobile responsive design works
- ✅ All wallet features functional
- ✅ DNS propagated globally

### **Business Benefits:**
- 🚀 **Professional branding** with custom domain
- 📱 **Better mobile app integration**
- 🔍 **Improved SEO** with branded URL
- 💼 **Enhanced credibility** for users
- 📊 **Better analytics tracking**

---

## 📞 **Support**

### **If You Need Help:**
1. **Check Netlify docs**: `https://docs.netlify.com/domains-https/`
2. **Hostinger support**: For DNS configuration help
3. **DNS propagation checker**: `https://dnschecker.org`

**Your Happy Paisa App will soon be accessible at your custom domain!** 🎊

---

## 🎯 **Quick Start Command**
Once DNS is configured, test immediately:
```bash
curl -I https://happypaisa.com
# Should return 200 OK with your app
```

**Ready to make Happy Paisa App available on your branded domain!** 🌟