const LayersInfo = require('../pageObjects/LayersInfo');
const { uploadFileViaAutoIt } = require('../fixtures/User interface');
const { readExcel } = require('../TDD/ExcelReader');

class LayersInfoFlow {
    static data = readExcel('LayersInfoFlow');

    static async layersInfoFlow(page, data) {
        const layersInfo = new LayersInfo(page);
        await uploadFileViaAutoIt(layersInfo.upload(), 'Open', data.Layers_path);
    }
}

module.exports = LayersInfoFlow;
