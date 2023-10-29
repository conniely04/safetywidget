import * as hmUI from "@zos/ui";
import AutoGUI from "@silver-zepp/autogui";
import { createWidget, widget, prop } from "@zos/ui";
import { Vibrator, VIBRATOR_SCENE_DURATION } from "@zos/sensor";
import { log as Logger } from "@zos/utils";
import { BasePage } from "@zeppos/zml/base-page";
import { Geolocation } from "@zos/sensor";

import {
  FETCH_BUTTON,
  FETCH_RESULT_TEXT,
} from "zosLoader:./index.[pf].layout.js";
import { create, id } from "@zos/media";

const player = create(id.PLAYER);

const gui = new AutoGUI();
const logger = Logger.getLogger("fetch_api");
const vibrator = new Vibrator();
vibrator.setMode(VIBRATOR_SCENE_STRONG_REMINDER);
const geolocation = new Geolocation();
geolocation.start();

const text = createWidget(widget.TEXT, {
  x: 96,
  y: 120,
  w: 288,
  h: 46,
  color: 0xffffff,
  text_size: 36,
  text: "",
});

var lattext = 0;
var lontext = 0;

var callback = () => {
  if (geolocation.getStatus() === "A") {
    lattext = geolocation.getLatitude();
    lontext = geolocation.getLongitude();
  }
};
geolocation.onChange(callback);

let textWidget;

Page(
  BasePage({
    state: {},
    build() {
      const shadowSOS = createWidget(widget.CIRCLE, {
        center_x: 240,
        center_y: 250,
        radius: 150,
        color: 0x3f2222,
        alpha: 255,
      });
      const button = createWidget(widget.BUTTON, {
        x: 100,
        y: 90,
        w: 300,
        h: 300,
        radius: 300,
        normal_color: 0x9e2828,
        press_color: 0x9e2828,
        text: "SOS",
        text_size: 120,
        click_func: (button_widget) => {
          this.fetchData();
          button_widget.setProperty(prop.MORE, {
            x: 90,
            y: 105,
            w: 300,
            h: 300,
            radius: 300,
            TEXT_STYLE,
          });
          hmUI.createWidget(hmUI.widget.TEXT, {
            data,
          });
          player.setSource(player.source.FILE, {
            file: "raw/SOS_Siren.mp3",
          });
          vibrator.start();

          const img_hour = createWidget(widget.IMG);
          img_hour.setProperty(prop.MORE, {
            x: 0,
            y: 0,
            w: 500,
            h: 500,
            src: "/raw/mapImage2.png",
          });
          const textbutt = createWidget(widget.BUTTON, {
            x: (480 - 400) / 2,
            y: 100,
            w: 400,
            h: 50,
            radius: 12,
            text_size: 22,
            color: 0x000000,
            normal_color: 0xbfafaf,
            press_color: 0xbfafaf,
            text: "District Six",
          });

          console.log(lattext);
        },
      });
    },
    fetchData() {
      console.log("watch fetch data");

      this.request({
        method: "GET_DATA",
        lat: geolocation.getLatitude(),
        lon: geolocation.getLongitude(),
      })
        .then((data) => {
          console.log(data);
          const { text } = data;
          textbutt.addEventListener(event.CLICK_DOWN, (info) => {
            textbutt.setProperty(prop.MORE, {
              text: data,
            });
          });

          if (!textWidget) {
            textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
              ...FETCH_RESULT_TEXT,

              text,
            });
          } else {
            textWidget.setProperty(hmUI.prop.TEXT, text);
          }
        })
        .catch((res) => {
          console.log("watch fetch data failed");
          console.log(res);
        });
    },
  })
);
