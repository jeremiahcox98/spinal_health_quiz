# Spinal Health Quiz Widget

This widget allows you to embed the Spinal Health Quiz directly into any webpage without using an iframe. This eliminates sizing and responsivity issues.

## Benefits Over Iframe

- ✅ **No fixed heights** - Content naturally determines size
- ✅ **No scrollbars** - Natural overflow handling
- ✅ **Better mobile experience** - Adapts to any screen size
- ✅ **No cross-origin communication** - Direct DOM access
- ✅ **Same backend** - Still uses Cloudflare Pages Function

## How to Use

### Step 1: Add Target Element

Add a `<div>` with the ID `spinal-health-quiz` where you want the quiz to appear:

```html
<div id="spinal-health-quiz"></div>
```

### Step 2: Include the Widget Script

Add the widget loader script before the closing `</body>` tag:

```html
<script src="https://spinal-health-quiz.pages.dev/widget.js"></script>
```

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Welcome to My Site</h1>
    
    <!-- Quiz will appear here -->
    <div id="spinal-health-quiz"></div>
    
    <p>More content below...</p>
    
    <!-- Load the widget -->
    <script src="https://spinal-health-quiz.pages.dev/widget.js"></script>
</body>
</html>
```

## CSS Isolation

All widget CSS classes are prefixed with `shq-` to prevent conflicts with your site's styles. The widget uses:

- CSS variables scoped to `.shq-widget-wrapper`
- Namespaced class names (e.g., `.shq-quiz-card`, `.shq-answer`)
- Scoped IDs (e.g., `shq-quizContainer`)

## Styling

The widget has a default background color of `#F4F1ED`. If you want to match your site's background, you can add custom CSS:

```css
#spinal-health-quiz .shq-widget-wrapper {
    background: your-color-here;
}
```

## Responsive Behavior

The widget automatically adapts to:
- Desktop screens (max-width: 720px)
- Mobile screens (max-width: 640px)
- Any container width

## API Endpoint

The widget automatically uses the Cloudflare Pages API endpoint:
- `https://spinal-health-quiz.pages.dev/api/submit`

No configuration needed - it works out of the box!

## Files

- `widget.js` - Loader script that injects the quiz
- `widget.html` - Self-contained quiz with namespaced CSS
- `widget-embed-example.html` - Example of how to embed

## Testing Locally

1. Serve the files using a local server (e.g., `python -m http.server` or `npx serve`)
2. Open `widget-embed-example.html` in your browser
3. The widget should load and function normally

## Deployment

After deploying to Cloudflare Pages:
- `widget.js` will be available at: `https://spinal-health-quiz.pages.dev/widget.js`
- `widget.html` will be available at: `https://spinal-health-quiz.pages.dev/widget.html`

Both files are automatically served as static assets.
