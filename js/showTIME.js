var ci = new Clock({
    mode: ClockAPI.Mode.none,
    positionH: ClockAPI.PositionH.center,
    positionV: ClockAPI.PositionV.center
});
ci.start();

var bg = new Background({
    element: document.body,
    mode: BackgroundAPI.Mode.linearGradient
}, {
    fillColor: new BackgroundAPI.FillColor({
        color: "rgb(130, 201, 96)"
    }),
    linearGradient: new BackgroundAPI.LinearGradient({
        angle: 0,
        beginColor: "rgb(183, 255, 176)",
        endColor: "rgb(33, 36, 194)"
    }),
    radialGradient: new BackgroundAPI.RadialGradient({
        innerColor: "rgb(175, 207, 255)",
        outerColor: "rgb(34, 97, 193)",
        position: BackgroundAPI.RadialGradientAPI.Position.followMouse,
        shape: BackgroundAPI.RadialGradientAPI.Shape.circle,
    }),
    image: new BackgroundAPI.Image({
        path: "file:///",
        repeat: BackgroundAPI.ImageAPI.Repeat.norepeat,
        size: BackgroundAPI.ImageAPI.Size.cover
    })
});

function getRGB(nonrgb) {
    var ret = nonrgb.split(' ');
    ret = ret.map(function(c) {
        return Math.ceil(c * 255);
    });
    return "rgb(" + ret.join(',') + ")";
}

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {

        // ++++++++++++++++++++++
        // +++ CLOCK SETTINGS +++
        // ++++++++++++++++++++++
        if (properties.clock_clocktype) {
            ci.options.mode = properties.clock_clocktype.value;
        }
        if (properties.clock_position_h) {
            ci.options.positionH = properties.clock_position_h.value;
        }
        if (properties.clock_position_v) {
            ci.options.positionV = properties.clock_position_v.value;
        }
        if (properties.clock_binary_dotcolor) {
            ci.options.binary.dotColor = getRGB(properties.clock_binary_dotcolor.value);
        }
        if (properties.clock_binary_dotcoloractive) {
            ci.options.binary.dotColorActive = getRGB(properties.clock_binary_dotcoloractive.value);
        }
        if (properties.clock_binary_dotsize) {
            ci.options.binary.dotSizePx = properties.clock_binary_dotsize.value;
        }
        if (properties.clock_digital_timeformat) {
            ci.options.digital.timeFormat = properties.clock_digital_timeformat.value;
        }
        if (properties.clock_digital_fontcolor) {
            ci.options.digital.fontColor = getRGB(properties.clock_digital_fontcolor.value);
        }
        if (properties.clock_digital_fontsize) {
            ci.options.digital.fontSizePx = properties.clock_digital_fontsize.value;
        }

        // ++++++++++++++++++
        // +++ BACKGROUND +++
        // ++++++++++++++++++
        if (properties.background_type) {
            bg.options.mode = properties.background_type.value;
        }
        if (properties.background_fillcolor_color) {
            bg.fillColor.options.color = getRGB(properties.background_fillcolor_color.value);
        }
        if (properties.background_lineargradient_angle) {
            bg.linearGradient.options.angle = properties.background_lineargradient_angle.value;
        }
        if (properties.background_lineargradient_startcolor) {
            bg.linearGradient.options.beginColor = getRGB(properties.background_lineargradient_startcolor.value);
        }
        if (properties.background_lineargradient_endcolor) {
            bg.linearGradient.options.endColor = getRGB(properties.background_lineargradient_endcolor.value);
        }
        if (properties.background_radialgradient_position) {
            bg.radialGradient.options.position = properties.background_radialgradient_position.value;
        }
        if (properties.background_radialgradient_shape) {
            bg.radialGradient.options.shape = properties.background_radialgradient_shape.value;
        }
        if (properties.background_radialgradient_innercolor) {
            bg.radialGradient.options.innerColor = getRGB(properties.background_radialgradient_innercolor.value);
        }
        if (properties.background_radialgradient_outercolor) {
            bg.radialGradient.options.outerColor = getRGB(properties.background_radialgradient_outercolor.value);
        }
        if (properties.background_image_basecolor) {
            bg.image.options.baseColor = getRGB(properties.background_image_basecolor.value);
        }
        if (properties.background_image_path) {
            bg.image.options.path = "file:///" + properties.background_image_path.value;
        }
        if (properties.background_image_position) {
            bg.image.options.position = properties.background_image_position.value;
        }
        if (properties.background_image_repeat) {
            bg.image.options.repeat = properties.background_image_repeat.value;
        }
        if (properties.background_image_size) {
            bg.image.options.size = properties.background_image_size.value;
        }
        bg.refresh();

    }
};
