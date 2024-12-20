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

    RED.nodes.registerType("iiot2k-ads1115-m", function(n) {
        var node = this;
        RED.nodes.createNode(node, n);

        node.port = n.port;
        node.devadr = parseInt(n.devadr);

        node.gain = parseInt(n.gain);
        node.rate = parseInt(n.rate);
        node.rawdata = n.rawdata;

        node.tupdate = n.tupdate;

        const set_mux = (mux) => {
            switch(mux) {
                case "0": return adc.MUX_I0_I1; 
                case "1": return adc.MUX_I0_I3; 
                case "2": return adc.MUX_I1_I3; 
                case "3": return adc.MUX_I2_I3; 
                case "4": return adc.MUX_I0_GND; 
                case "5": return adc.MUX_I1_GND; 
                case "6": return adc.MUX_I2_GND; 
                case "7": return adc.MUX_I3_GND; 
                case "8": return adc.MUX_DISABLE; 
            }
        }

        node.mux = [set_mux(n.mux0), set_mux(n.mux1), set_mux(n.mux2), set_mux(n.mux3)];
        node.onwork = false;
        node.name = "ads1115-m " + node.port + "@" + (0x48 + node.devadr).toString(16).toUpperCase();

        syslib.setStatus(node, "", "grey");

        node.id_interval = setInterval(() => {
            if (node.onwork)
                return;

            node.onwork = true;

            adc.read_multi(node.port, node.devadr, node.mux, node.gain, node.rate, node.rawdata, 
            (data) => {
                if (data === undefined)
                    syslib.outError(node, adc.error_text());
                else if (JSON.stringify(data) !== node.preval) {
                    node.preval = JSON.stringify(data);
                    node.send({ payload: data, topic: node.name });
                    syslib.setStatus(node, data);
                }
                else
                    syslib.setStatus(node, data);

                node.onwork = false;
            })
        }, node.tupdate);

        node.on('close', () => {
            clearInterval(node.id_interval);
        });
    });
}
