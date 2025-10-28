# Mobile Testing Setup for Mario Health

This guide covers how to test Mario Health on mobile devices for optimal user experience.

## Prerequisites

- Node.js 18+ installed
- Mobile device (iOS/Android) or Chrome DevTools
- Local network access

## Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Find your local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig | findstr "IPv4"
   ```

4. **Access from mobile device:**
   - Connect your mobile device to the same WiFi network
   - Open browser and navigate to: `http://[YOUR_IP]:3000`
   - Example: `http://192.168.1.100:3000`

## Testing Checklist

### Touch Targets
- [ ] All buttons are at least 44px in height/width
- [ ] Touch targets have adequate spacing (8px minimum)
- [ ] Visual feedback on tap (scale/color change)

### iOS-Specific Testing
- [ ] Search inputs don't zoom when focused
- [ ] Safe area insets work on devices with notches
- [ ] Landscape orientation displays correctly
- [ ] Pull-to-refresh works smoothly

### Performance
- [ ] Images load progressively
- [ ] Components lazy load as expected
- [ ] Smooth scrolling on iOS
- [ ] No layout shifts during loading

### Network Testing
- [ ] Works on slow connections (2G/3G)
- [ ] Offline state handled gracefully
- [ ] Pull-to-refresh works without network

## Chrome DevTools Mobile Emulation

1. **Open Chrome DevTools** (F12)
2. **Click device toggle** (mobile icon)
3. **Select device preset** or create custom:
   - iPhone 14 Pro Max
   - Samsung Galaxy S20
   - iPad Pro

4. **Test specific scenarios:**
   - Portrait/landscape orientation
   - Slow 3G network throttling
   - Touch events simulation

## Device-Specific Testing

### iOS Testing
- **Safari**: Primary browser for iOS testing
- **Test on actual devices**: iPhone 12+, iPad
- **Check safe areas**: Devices with notches/Dynamic Island
- **Test keyboard behavior**: Search inputs, form submissions

### Android Testing
- **Chrome**: Primary browser for Android testing
- **Test on actual devices**: Various screen sizes
- **Check back button behavior**: Navigation consistency
- **Test different Android versions**: 8.0+

## Performance Monitoring

### Lighthouse Mobile Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run mobile audit
lighthouse http://localhost:3000 --view --preset=perf
```

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Common Issues & Solutions

### Input Zoom on iOS
**Problem**: Input fields zoom when focused
**Solution**: Ensure `font-size: 16px` on inputs

### Safe Area Issues
**Problem**: Content hidden behind notch/Dynamic Island
**Solution**: Use `safe-area-inset-*` CSS properties

### Touch Target Too Small
**Problem**: Buttons hard to tap accurately
**Solution**: Minimum 44px touch targets with adequate spacing

### Slow Loading
**Problem**: Images/components load slowly
**Solution**: Implement lazy loading and image optimization

## Network Configuration

### Allow External Access
Update `next.config.ts`:
```typescript
const nextConfig = {
  // ... existing config
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};
```

### HTTPS for Production Testing
For production-like testing with HTTPS:
```bash
# Install mkcert for local SSL
brew install mkcert  # macOS
# or
choco install mkcert  # Windows

# Generate certificates
mkcert localhost 192.168.1.100

# Update package.json scripts
"dev:https": "next dev --experimental-https --experimental-https-key ./localhost-key.pem --experimental-https-cert ./localhost.pem"
```

## Testing Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dev:mobile": "next dev -H 0.0.0.0",
    "test:mobile": "lighthouse http://localhost:3000 --view --preset=perf",
    "build:analyze": "ANALYZE=true npm run build"
  }
}
```

## Mobile-First Development

### CSS Approach
- Start with mobile styles first
- Use `min-width` media queries for larger screens
- Test on smallest supported device first

### Component Design
- Touch-first interactions
- Adequate spacing for fingers
- Clear visual hierarchy
- Fast loading states

## Troubleshooting

### Can't Access from Mobile Device
1. Check firewall settings
2. Ensure devices are on same network
3. Try disabling VPN/proxy
4. Use `0.0.0.0` instead of `localhost`

### Performance Issues
1. Enable React DevTools Profiler
2. Check Network tab for slow requests
3. Use Lighthouse for performance audit
4. Monitor Core Web Vitals

### Layout Issues
1. Test on multiple device sizes
2. Check CSS Grid/Flexbox compatibility
3. Verify viewport meta tag
4. Test orientation changes

## Resources

- [Web.dev Mobile Testing](https://web.dev/mobile-testing/)
- [iOS Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/)
- [Android WebView Documentation](https://developer.chrome.com/docs/android/webview/)
- [Lighthouse Mobile Audits](https://developers.google.com/web/tools/lighthouse)
