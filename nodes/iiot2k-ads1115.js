/**
 * Copyright 2024 Derya Y. (iiot2k@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

"use strict";

module.exports = function(RED) {
    const syslib = require("./syslib.js");
    const adc = require("@iiot2k/ads1115");

    if (adc === undefined)
        throw new Error("driver error @iiot2k/ads1115");

    RED.nodes.registerType("iiot2k-ads1115", function(n) {
        var node = this;
        RED.nodes.createNode(node, n);

        node.port = n.port;
        node.devadr = parseInt(n.devadr);

        node.gain = parseInt(n.gain);
        node.rate = parseInt(n.rate);
        node.rawdata = n.rawdata;

        node.tupdate = n.tupdate;

        switch(n.mux) {
            case "0": node.mux = adc.MUX_I0_I1; node.mux_txt = "A0-A1: "; break; 
            case "1": node.mux = adc.MUX_I0_I3; node.mux_txt = "A0-A3: "; break; 
            case "2": node.mux = adc.MUX_I1_I3; node.mux_txt = "A1-A3: "; break; 
            case "3": node.mux = adc.MUX_I2_I3; node.mux_txt = "A2-A3: "; break; 
            case "4": node.mux = adc.MUX_I0_GND; node.mux_txt = "A0: "; break; 
            case "5": node.mux = adc.MUX_I1_GND; node.mux_txt = "A1: "; break; 
            case "6": node.mux = adc.MUX_I2_GND; node.mux_txt = "A2: "; break; 
            case "7": node.mux = adc.MUX_I3_GND; node.mux_txt = "A3: "; break; 
        }

        node.onwork = false;
        node.name = "ads1115 " + node.port + "@" + (0x48 + node.devadr).toString(16).toUpperCase();

        syslib.setStatus(node, node.mux_txt, "grey");

        node.id_interval = setInterval(() => {
            if (node.onwork)
                return;

            node.onwork = true;

            adc.read(node.port, node.devadr, node.mux, node.gain, node.rate, node.rawdata, 
            (data) => {
                if (data === undefined)
                    syslib.outError(node, adc.error_text());
                else if (data !== node.preval) {
                    node.preval = data;
                    node.send({ payload: data, topic: node.name });
                    syslib.setStatus(node, node.mux_txt + data);
                }
                else
                    syslib.setStatus(node, node.mux_txt + data);

                node.onwork = false;
            })
        }, node.tupdate);

        node.on('close', () => {
            clearInterval(node.id_interval);
        });
    });
}
