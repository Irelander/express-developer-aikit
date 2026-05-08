# Code patterns for panel UI

## SWC Express theme imports

~~~js
import "@spectrum-web-components/styles/typography.css";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/express/scale-medium.js";
~~~

## Theme container pattern

~~~html
<sp-theme system="express" color="light" scale="medium">
  <!-- panel content here -->
</sp-theme>
~~~

## UI review checklist

- loading state exists
- empty state exists
- disabled actions are explained
- long-running work shows progress or feedback
