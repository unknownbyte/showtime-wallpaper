/*!ClockAPI.js
 * API for rendering clock.
 * 
 * (c) 2018 Patrick Goldinger. All rights reserved.
 */

const ClockAPI = {
    Mode: Object.freeze({
        analog: 1,
        binary: 3,
        digital: 2,
        none: 0
    }),
    PositionH: Object.freeze({
        center: 2,
        left: 1,
        right: 3
    }),
    PositionV: Object.freeze({
        bottom: 3,
        center: 2,
        top: 1
    }),
    TimeFormat: Object.freeze({
        h12: 1,
        h24: 2
    })
}

class Clock {
    constructor(initOptions) {
        this.options = {
            analog: {},
            binary: {
                dotColor: "rgb(255,255,255)",
                dotColorActive: "rgb(0,0,0)",
                dotSizePx: 35
            },
            digital: {
                fontColor: "rgb(255,255,255)",
                fontSizePx: 60,
                timeFormat: ClockAPI.TimeFormat.h24
            },
            mode: ClockAPI.Mode.analog,
            positionH: ClockAPI.PositionH.center,
            positionV: ClockAPI.PositionV.center
        }
        Object.assign(this.options, initOptions);
        this._elements = {
            analog: document.getElementById("clock-analog"),
            analog_hand_hour: document.getElementById("clock-analog-hand-hour"),
            analog_hand_minute: document.getElementById("clock-analog-hand-minute"),
            analog_hand_second: document.getElementById("clock-analog-hand-second"),
            digital: document.getElementById("clock-digital"),
            digital_value: document.getElementById("clock-digital-value"),
            binary: document.getElementById("clock-binary")
        }
        this._intervActive = false;
        this._bctx = this._elements.binary.getContext("2d");
    }

    setupClock() {
        var mode = ["none", "analog", "digital", "binary"],
            posH = ["left", "center", "right"],
            posV = ["top", "center", "bottom"]
        document.body.setAttribute("data-clock-clocktype", mode[this.options.mode]);
        document.body.setAttribute("data-clock-position-h", posH[this.options.positionH - 1]);
        document.body.setAttribute("data-clock-position-v", posV[this.options.positionV - 1]);
        this._elements.binary.width = this.options.binary.dotSizePx * 1.2 * 6;
        this._elements.binary.height = this.options.binary.dotSizePx * 1.2 * 4;
        this._elements.digital.style.color = this.options.digital.fontColor;
        this._elements.digital.style.fontSize = this.options.digital.fontSizePx + "px";
    }

    start() {
        this._intervActive = true;
        this._interv(this);
    }

    stop() {
        this._intervActive = false;
    }

    _getBin4(num) {
        if (num === "")
            num = parseInt(num, 10);
        var ret = [false, false, false, false], n = 8, i = 0;
        for (; n >= 1; n /= 2) {
            if (num >= n) {
                ret[i] = true;
                num -= n;
            }
            i++;
        }
        return ret;
    }

    _interv(self) {
        var date = new Date();
        self.setupClock();
        switch (self.options.mode) {
            case ClockAPI.Mode.analog:
                self._elements.analog_hand_second.style.transform = "rotate(" + (date.getSeconds() / 60) * 360 + "deg)";
                self._elements.analog_hand_minute.style.transform = "rotate(" + ((date.getMinutes() + date.getSeconds() / 60) / 60) * 360 + "deg)";
                self._elements.analog_hand_hour.style.transform = "rotate(" + ((date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60) / 12) * 360 + "deg)";
                break;
            case ClockAPI.Mode.digital:
                let timeString = "";
                if (self.options.digital.timeFormat == ClockAPI.TimeFormat.h12) {
                    timeString += ("00" + (date.getHours() % 12 || 12)).slice(-2) + ":";
                    timeString += ("00" + date.getMinutes()).slice(-2) + ":";
                    timeString += ("00" + date.getSeconds()).slice(-2) + " ";
                    timeString += date.getHours() >= 12 ? 'PM' : 'AM';
                }
                else {
                    timeString += ("00" + date.getHours()).slice(-2) + ":";
                    timeString += ("00" + date.getMinutes()).slice(-2) + ":";
                    timeString += ("00" + date.getSeconds()).slice(-2) + " ";
                } 
                self._elements.digital_value.innerHTML = timeString;
                break;
            case ClockAPI.Mode.binary:
                var hr = ("00" + date.getHours()).slice(-2).split().reverse().join(""),
                    mr = ("00" + date.getMinutes()).slice(-2).split().reverse().join(""),
                    sr = ("00" + date.getSeconds()).slice(-2).split().reverse().join(""),
                    dot = 1.2 * self.options.binary.dotSizePx,
                    dotHalf = dot / 2;
                var data = [
                    self._getBin4(hr[0]),
                    self._getBin4(hr[1]),
                    self._getBin4(mr[0]),
                    self._getBin4(mr[1]),
                    self._getBin4(sr[0]),
                    self._getBin4(sr[1])
                ], col_size = [2, 4, 3, 4, 3, 4], col, row;
                for (col = 0; col < 6; col++) {
                    for (row = 0; row < col_size[col]; row++) {
                        self._bctx.beginPath();
                        self._bctx.fillStyle = data[col][3 - row] ? self.options.binary.dotColorActive : self.options.binary.dotColor;
                        self._bctx.arc(dot * col + dotHalf, dot * (3 - row) + dotHalf, self.options.binary.dotSizePx / 2, 0, 2 * Math.PI);
                        self._bctx.fill();
                    }
                }
                break;
        }
        if (self._intervActive)
            setTimeout(function () {self._interv(self);}, 1000 - ((new Date()).getTime() - date.getTime()));
    }
}
