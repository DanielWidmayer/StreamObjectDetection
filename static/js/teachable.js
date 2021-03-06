// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
// const URL = 'https://teachablemachine.withgoogle.com/models/SRvgc7nT/';
var index = 0;
var test;
var webcam;
// Load the image model and setup the webcam

/**
  @param {String} URL -- link to teachable machines model
  @param {Number} index -- automatically assigned via factory
  @param {boolean} enableDOM -- if this create visualisation
  @return {class} instance of tfModel
  */

class tfModel {
  // model;
  // webcam;
  // maxPredictions;
  constructor(URL, index, enableDOM) {
    this.URL = URL;
    this.index = index;
    this.model;
    this.maxPredictions;
    this.enableDOM = enableDOM;
    this.init();
  }
  async init(URL) {
    console.log('DOM creation ' + this.enableDOM);
    var modelURL = this.URL + 'model.json';
    var metadataURL = this.URL + 'metadata.json';

    try {
      if (this.enableDOM) {
        $.ajax({
          type: 'GET',
          url: metadataURL,
          data: 'data',
          dataType: 'json',
          success: function(response) {
            document.getElementById('label-header-' + index).innerHTML = response.modelName;
          }
        });
      } else {
        $.ajax({
          type: 'GET',
          url: metadataURL,
          data: 'data',
          dataType: 'json'
        });
      }
    } catch (error) {
      console.log(error);
    }
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    this.model = await tmImage.load(modelURL, metadataURL);
    this.maxPredictions = this.model.getTotalClasses();
    window.requestAnimationFrame(this.loop.bind(this));
    if (this.index == 0) {
      // append elements to the DOM
      document.getElementById('webcam-container-' + this.index).appendChild(webcam.canvas);
    }
    if (this.enableDOM) {
      await this.createDOM();
    }
    ++index;
  }

  async createDOM() {
    let labelContainer = document.getElementById('label-container-' + this.index);
    for (let i = 0; i < this.maxPredictions; i++) {
      // and class labels
      let container = document.createElement('div');
      let pred = document.createElement('div');
      let bar_container = document.createElement('div');
      let bar = document.createElement('div');
      labelContainer.appendChild(container);
      container.appendChild(pred);
      pred.setAttribute('class', 'pred');
      container.appendChild(bar_container);
      bar_container.setAttribute('class', 'bar-container');
      bar_container.appendChild(bar);
      bar.setAttribute('class', i + ' bar');
    }
    $('#label-container-' + this.index)
      .children()
      .addClass('pred-container');
    $('.bar-container')
      .children()
      .css('background-color', 'red');
  }

  async loop() {
    webcam.update(); // update the webcam frame
    if (this.enableDOM) {
      await this.predict();
    } else {
      await this.predictClassOnly().then(index => {
        if (objectsLoaded == true) {
          callIndex = index;
        }
      });
    }
    window.requestAnimationFrame(this.loop.bind(this));
  }
  // run the webcam image through the image model
  async predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await this.model.predict(webcam.canvas);
    for (let i = 0; i < this.maxPredictions; i++) {
      const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
      $('#label-container-' + this.index + ' div .pred')[i].innerHTML = classPrediction;
      let pred = prediction[i].probability.toFixed(2);
      let styles = { width: pred * 100 + '%', background: rgbToHex(255, 0, 255 * pred) };
      $('#label-container-' + this.index + ' div .bar-container')
        .children('.' + i)
        .css(styles);
    }
  }
  // NOTE for MOCK
  async predictClassOnly() {
    const prediction = await this.model.predict(webcam.canvas);
    for (let i = 0; i < this.maxPredictions; i++) {
      const className = prediction[i].className;
      const classPrediction = prediction[i].probability.toFixed(2);
      if (classPrediction > 0.95) {
        //console.log(i + ':  ' + className);
        return i; //+ className
      }
    }
    return '0No Object detected';
  }
}
async function createSetup() {
  let tfContainer = $('#tf-container');
  let row = $('<div class="row ' + this.index + '"></div>');
  tfContainer.before(row);
  let col4 = $('<div class="col-lg-4 ' + this.index + '"></div>');
  row.append(col4);
  let webcamWrapper = $('<div class="webcam-wrapper ' + this.index + '"></div>');
  col4.append(webcamWrapper);
  let webcamContainer = $('<div id="webcam-container-' + this.index + '"></div>');
  webcamWrapper.append(webcamContainer);
  let col8 = $('<div class="col-lg-8 ' + this.index + '"></div>');
  row.append(col8);
  let labelHeader = $('<div id="label-header-' + this.index + '"></div>');
  col8.append(labelHeader);
  let labelContainer = $('<div id="label-container-' + this.index + '"></div>');
  col8.append(labelContainer);
}
async function webcamSetup() {
  // Convenience function to setup a webcam
  let width;
  let height;
  width = parseInt($('.streamWrapper').css('width'));
  height = parseInt($('.streamWrapper').css('height'));
  console.log(width, height);
  const flip = false; // whether to flip the webcam
  webcam = new tmImage.Webcam(width, height, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  webcam.play();
}
async function modelFactory(URL, enableDOM) {
  if (enableDOM) {
    await createSetup();
  }
  if (index == 0) {
    await webcamSetup();
  }
  new tfModel(URL, index, enableDOM);
}

/**
  @param {String} URL -- link to teachable machines model
  @param {boolean} enableDOM -- true = create visualisation false = only prediction
  */
async function addModel(URL, enableDOM) {
  if (validURL(URL)) {
    await modelFactory(URL, enableDOM);
  } else {
    alert(URL + ' is not a valid url');
  }
}
function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}
function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}
// $(document).ready(function() {
//   addModel('https://teachablemachine.withgoogle.com/models/N_aZhUzm/', false);
// });

$(document).ready(function() {
  addModel('https://teachablemachine.withgoogle.com/models/cXicXXxX/', false);
});
