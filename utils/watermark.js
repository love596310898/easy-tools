export const canvasWM = ({
  container = document.body,
  width = '300px',
  height = '300px',
  font = "22",
  fillStyle = 'rgba(184, 184, 184, 0.6)',
  content = '贵州省公安厅',
  content2 = '4789',
  opacity = 0.3,
  code = null,
  hidden = false,
} = {}) => {
  const watermarkDiv = document.getElementById('watermark');
  if (hidden) {
    watermarkDiv && watermarkDiv.setAttribute('style', 'display: none');
    return;
  }
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <text x="50%" y="50%" dy="12px"
      text-anchor="middle"
      stroke="${fillStyle}"
      stroke-width="1"
      stroke-opacity="${opacity}"
      fill="none"
      transform="rotate(-45, 120 120)"
      style="font-size: ${font - 2}px;">
      ${content2}
    </text>
    <text x="50%" y="60%" dy="12px"
      text-anchor="middle"
      stroke="${fillStyle}"
      stroke-width="1"
      stroke-opacity="${opacity}"
      fill="none"
      transform="rotate(-45, 120 120)"
      style="font-size: ${font}px;">
      ${content}
    </text>
    <text x="50%" y="70%" dy="12px"
    text-anchor="middle"
    stroke="${fillStyle}"
    stroke-width="1"
    stroke-opacity="${opacity}"
    fill="none"
    transform="rotate(-45, 120 120)"
    style="font-size: ${font}px;">
    ${code}
  </text>
  </svg>`;
  const base64Url = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
  const styleStr = `
    display: block;
    background-repeat: repeat;
    background-position: center;
    background-image:url('${base64Url}')`;
  watermarkDiv.setAttribute('style', styleStr);
  container.insertBefore(watermarkDiv, container.firstChild);
};
