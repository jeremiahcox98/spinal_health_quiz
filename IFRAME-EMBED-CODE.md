# Iframe Embed Code for Spinal Health Quiz

## Responsive Iframe Code (Recommended)

Copy and paste this HTML code into your website where you want the quiz to appear. This version is fully responsive and works great on mobile:

```html
<div style="position: relative; width: 100%; max-width: 100%; overflow: hidden;">
    <iframe 
        src="https://spinal-health-quiz.pages.dev/" 
        width="100%" 
        height="560" 
        frameborder="0"
        title="Spinal Health Assessment Quiz"
        allow="clipboard-read; clipboard-write"
        loading="lazy"
        style="border: none; overflow: hidden; width: 100%; height: 560px; min-height: 500px; max-height: 90vh;"
    ></iframe>
</div>
```

**Mobile-optimized version using viewport height:**

```html
<div style="position: relative; width: 100%; max-width: 100%; overflow: hidden;">
    <iframe 
        src="https://spinal-health-quiz.pages.dev/" 
        width="100%" 
        frameborder="0"
        title="Spinal Health Assessment Quiz"
        allow="clipboard-read; clipboard-write"
        loading="lazy"
        style="border: none; overflow: hidden; width: 100%; height: 90vh; min-height: 500px; max-height: 700px;"
    ></iframe>
</div>
```

**Note:** 
- `90vh` = 90% of viewport height (responsive)
- `min-height: 500px` = ensures minimum size on very small screens
- `max-height: 700px` = prevents it from getting too tall on large screens

## Responsive Iframe with CSS (Best for Mobile)

For the best mobile experience, use this CSS-based responsive solution:

```html
<div style="position: relative; width: 100%; max-width: 100%; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <iframe 
        src="https://spinal-health-quiz.pages.dev/" 
        width="100%"
        frameborder="0"
        title="Spinal Health Assessment Quiz"
        allow="clipboard-read; clipboard-write"
        loading="lazy"
        style="border: none; overflow: hidden; width: 100%; height: 90vh; min-height: 500px; max-height: 700px; display: block;"
    ></iframe>
</div>
```

**With media queries for better mobile control:**

```html
<style>
.responsive-quiz-iframe {
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    border-radius: 12px;
}

.responsive-quiz-iframe iframe {
    border: none;
    width: 100%;
    height: 90vh;
    min-height: 500px;
    max-height: 700px;
    display: block;
}

@media (max-width: 768px) {
    .responsive-quiz-iframe iframe {
        height: 95vh;
        min-height: 600px;
    }
}

@media (max-width: 480px) {
    .responsive-quiz-iframe iframe {
        height: 100vh;
        min-height: 560px;
    }
}
</style>

<div class="responsive-quiz-iframe">
    <iframe 
        src="https://spinal-health-quiz.pages.dev/" 
        title="Spinal Health Assessment Quiz"
        allow="clipboard-read; clipboard-write"
        loading="lazy"
    ></iframe>
</div>
```

## Full Responsive Example with Styling

For a complete, styled embed with container:

```html
<div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <iframe 
            src="https://spinal-health-quiz.pages.dev/" 
            style="width: 100%; border: none; border-radius: 8px; min-height: 800px; display: block;"
            title="Spinal Health Assessment Quiz"
            allow="clipboard-read; clipboard-write"
            loading="lazy"
        ></iframe>
    </div>
</div>
```

## WordPress/Page Builder Usage

If you're using WordPress or a page builder:

1. **WordPress Block Editor:**
   - Add a "Custom HTML" block
   - Paste the iframe code above

2. **WordPress Classic Editor:**
   - Switch to "Text" mode
   - Paste the iframe code

3. **Page Builders (Elementor, Divi, etc.):**
   - Add an "HTML" or "Code" widget
   - Paste the iframe code

## Customization Options

### Adjust Height
Change the `min-height` or `height` value to fit your layout:
- Desktop: `800px` or `100vh` (full viewport height)
- Mobile: `600px` or adjust as needed

### Add Border/Shadow
```html
<iframe 
    src="https://spinal-health-quiz.pages.dev/" 
    style="width: 100%; border: 2px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); min-height: 800px;"
    title="Spinal Health Assessment Quiz"
    allow="clipboard-read; clipboard-write"
></iframe>
```

### Center the Iframe
```html
<div style="display: flex; justify-content: center; padding: 20px;">
    <iframe 
        src="https://spinal-health-quiz.pages.dev/" 
        style="width: 100%; max-width: 900px; border: none; min-height: 800px;"
        title="Spinal Health Assessment Quiz"
        allow="clipboard-read; clipboard-write"
    ></iframe>
</div>
```

## Notes

- The quiz URL is: `https://spinal-health-quiz.pages.dev/`
- The iframe will automatically resize based on content
- `loading="lazy"` helps with page load performance
- `allow="clipboard-read; clipboard-write"` enables clipboard features if needed
- The quiz is fully functional within the iframe

## Testing

After embedding, test:
1. ✅ Quiz loads correctly
2. ✅ All questions display properly
3. ✅ Email submission works
4. ✅ Results display correctly
5. ✅ Mobile responsiveness
