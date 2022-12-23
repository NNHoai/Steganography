var FOREGROUND_IMG = null;
var FOREGROUND_IMG_de = null;
var BACKGROUND_IMG = null;
var COMPOSITE_IMG = null;
var ENCRYPTED_IMG = null;

$('button.encodebtn, button.decode').click(function(event) {
  event.preventDefault();
});

// ----------------------UPLOAD & RESIZING SECTION----------------------------------

  function isForeGroundImageUploaded() {
    if (FOREGROUND_IMG == null || !FOREGROUND_IMG.complete()) {
      alert("Please upload a Foreground image");
      return false;
    }
    return true;
  }

  function isBackGroundImageUploaded() {
    if (BACKGROUND_IMG == null || !BACKGROUND_IMG.complete()) {
      alert("Please upload a Background image");
      return false;
    }
    return true;
  }

function previewEncodeImagecover() {
  var f = document.getElementById("cover");
  FOREGROUND_IMG = new SimpleImage(f);
  FOREGROUND_IMG.drawTo(coverCanvas_id);
  $(".form .imagecover").fadeIn();
  $(".form").fadeIn();
}

function previewEncodeImagehidden() {
  var b = document.getElementById("hidden");
  BACKGROUND_IMG = new SimpleImage(b);
  BACKGROUND_IMG.drawTo(hiddenCanvas_id);
  $(".form .imagehidden").fadeIn();
  $(".form").fadeIn();
}

function previewDecodeImagecover() {
  var f = document.getElementById("decode_cover");
  FOREGROUND_IMG_de = new SimpleImage(f);
  FOREGROUND_IMG_de.drawTo(coverdecode_id);
  $(".form .imagedecodecover").fadeIn();
  $(".form").fadeIn();
}
  function checkImageSize() {
    var wbg = BACKGROUND_IMG.getWidth();
    var wfg = FOREGROUND_IMG.getWidth();
    var hbg = BACKGROUND_IMG.getHeight();
    var hfg = FOREGROUND_IMG.getHeight();

    if (wbg != wfg || hbg != hfg) {
      alert("Sizes are not the same");
      changeSize();
    }
  } 

  function changeSize() {
    alert("Restoring Sizes \nEverything under control");
    BACKGROUND_IMG.setSize(FOREGROUND_IMG.getWidth(), FOREGROUND_IMG.getHeight());
    var secondCanvasContext = hiddenCanvas_id.getContext("2d");
    secondCanvasContext.clearRect(0, 0, coverCanvas_id.width, coverCanvas_id.height);
    BACKGROUND_IMG.drawTo(hiddenCanvas_id);
  }

// ---------------------------_STEGANOGRAPHY_CODE_-----------------------------------------
  function encodeMessage() {
    if (isForeGroundImageUploaded() && isBackGroundImageUploaded()) {

      checkImageSize();

      FOREGROUND_IMG = chopImage1(FOREGROUND_IMG);
      BACKGROUND_IMG = chopImage2(BACKGROUND_IMG);
      ENCRYPTED_IMG = combineImages(FOREGROUND_IMG, BACKGROUND_IMG);

      ENCRYPTED_IMG.drawTo(messageencode_id);
      $(".images").fadeIn();
      alert("!!! Congratulations, your  image has been successfully Encrypted!!!\n!!!Observe Carefully..!!!\nNow try decrypting your image");
      

    }
  }

  function chopImage1(image) {
    for (var px of image.values()) {
      px.setRed(clearBits(px.getRed()));
      px.setGreen(clearBits(px.getGreen()));
      px.setBlue(clearBits(px.getBlue()));
    }
    return image;
  }
  
  function clearBits(value) {
    return Math.floor(value / 16) * 16;
  }

  function chopImage2(image) {
    for (var px of image.values()) {
      px.setRed(px.getRed() / 16);
      px.setGreen(px.getGreen() / 16);
      px.setBlue(px.getBlue() / 16);
    }
    return image;

  }

  function combineImages(image1, image2) {
    var ouput_image = new SimpleImage(image1.getWidth(), image1.getHeight());

    for (var px of ouput_image.values()) {
      
      var x = px.getX();
      var y = px.getY();

      var image1_pixel = image1.getPixel(x, y);
      var image2_pixel = image2.getPixel(x, y);

      px.setRed(image1_pixel.getRed() + image2_pixel.getRed());
      px.setGreen(image1_pixel.getGreen() + image2_pixel.getGreen());
      px.setBlue(image1_pixel.getBlue() + image2_pixel.getBlue());

    }
    return ouput_image;
  }

  function decodeMessage() {
    // if (isForeGroundImageUploaded() && isBackGroundImageUploaded()) {
    //   if (ENCRYPTED_IMG != null) {
        var extractedImg = extractHiddenImage(FOREGROUND_IMG_de);
        extractedImg.drawTo(messagedecode_id);
        $(".decode").fadeIn();
        
        // document.getElementById("decrypt_btn").disabled = true;
    //   }
    //   else {
    //     alert("Please EnCrypt the Image before Decrypting");
    //   }
    // }
  }

  function extractHiddenImage(image) {
    for (var px of image.values()) {
      px.setRed(extractBits(px.getRed()));
      px.setGreen(extractBits(px.getGreen()));
      px.setBlue(extractBits(px.getBlue()));
    }
    return image;
  }

  function extractBits(value) {
    return (value % 16) * 16;
  }



