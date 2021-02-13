const canvas = document.querySelector('.canvas');
const file = document.querySelector('#file');
const size = document.querySelector('#size');
const ctx = canvas.getContext('2d');
const reader = new FileReader();
const image = new Image();

const initialState = {
    image: null,
    aspectRatio: null,
    dataURL: null,
    scale: 1,
    canvas: {
        width: 0,
        height: 0,
        originalWidth: 0,
        originalHeight: 0,
    }
}
const imageProperties = {
    blur: 0,
    sepia: 0,
    'hue-rotate' : 0,
    greyscale: 0,
    brightness: 0,
    invert: 0,
    contrast: 0,
}

if(typeof ctx.filter == "undefined"){
    alert('browser not supported change or update it.');
}
file.addEventListener('change', (event) => {
    reader.readAsDataURL(event.target.files[0]);
});

reader.onload = () => {
    image.src = reader.result;
}
image.onload = () => {
    initialState.image = image;
    drawImageScaled(image);
}

const drawImageScaled = (img) => {

    const imageWidth = img.width;
    const imageHeight = img.height;
    let height;
    let width;
    if(imageWidth > imageHeight){
        width = 550;
        height = width * (imageHeight / imageWidth);
    }

    createImageBitmap(
        img, 
        { resizeWidth: width, resizeHeight: height, resizeQuality: 'high' }
    )
    .then(imageBitmap =>{
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        initialState.image = imageBitmap;
        canvas.style.display = 'block';
        canvas.classList.remove('init');
        updateCanvas()
    });
}

const updateCanvas = () => {
    let arr = [];
    Object.keys(imageProperties).forEach((property) => {
        const value = imageProperties[property];
        value !== 0 && arr.push(`${property}(${value})`);
    })
    const style = arr.join(' ');
    ctx.filter = style;
    console.log(style);
    ctx.drawImage(initialState.image, 0, 0)
}

// blur  
const blur = document.querySelector('#blur');

blur.addEventListener('input', (e) => {
    const blurRadius = parseFloat(e.target.value);
    imageProperties.blur = `${blurRadius}px`;
    updateCanvas();
})

// sepia
const sepia = document.querySelector('#sepia');

sepia.addEventListener('input', (e) => {
    const sepiaRadius = parseFloat(e.target.value);
    imageProperties.sepia = ` ${sepiaRadius}%`;
    updateCanvas()
})

// brightness  
const brightness = document.querySelector('#brightness');

brightness.addEventListener('input', (e) => {
    const brightnessRadius = parseFloat(e.target.value);
    imageProperties.brightness = `${brightnessRadius}`;
    updateCanvas()
})

// contrast  
const contrast = document.querySelector('#contrast');

contrast.addEventListener('input', (e) => {
    const contrastRadius = parseFloat(e.target.value);
    imageProperties.contrast = `${contrastRadius}%`;
    updateCanvas()
})

// hue-rotate  
const hueRotate = document.querySelector('#hue-rotate');

hueRotate.addEventListener('input', (e) => {
    const hueRotateRadius = parseFloat(e.target.value);
    imageProperties['hue-rotate'] = `${hueRotateRadius}deg`;
    updateCanvas()
})

// greyScale  
const greyScale = document.querySelector('#greyscale');

greyScale.addEventListener('input', (e) => {
    const greyScaleRadius = parseFloat(e.target.value);
    imageProperties.greyscale = `${greyScaleRadius}%`;
    updateCanvas()
})

// invert
const invert = document.querySelector('#invert');

invert.addEventListener('input', (e) => {
    const invertRadius = parseFloat(e.target.value);
    imageProperties.invert = `${invertRadius}%`;
    updateCanvas()
})


const download = document.querySelector('#download');

download.addEventListener('click', () =>{
    const a = document.createElement('a');

    ctx.scale(initialState.scale, initialState.scale)
    
    a.href = canvas.toDataURL();
    a.download = "image.png"
    a.click();
    
    ctx.scale(1, 1)
})