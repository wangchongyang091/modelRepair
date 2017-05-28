var ModelRepair = {
    init: function() {
        ModelRepair.initVendorOption();
        ModelRepair.changeModelOption(document.getElementById('vendor').value);
        ModelRepair.initDevTypeOption();
    },
    validateDevInfo: function() {
        var sysoidEle = document.getElementById('sysoid');
        if (!/^\d+(\.\d+)+$/.test(sysoidEle.value.trim())) {
            ModelRepair.errorShake(sysoidEle, '请输入正确的sysoid');
            return false;
        }
        var modleNumberEle = document.getElementById('modelNumber');
        if (!modleNumberEle.value.trim()) {
            ModelRepair.errorShake(modleNumberEle, '请输入设备型号');
            return false;
        }
        var seriesEle = document.getElementById('series');
        if (!seriesEle.value.trim()) {
            ModelRepair.errorShake(seriesEle, '请输入设备系列号');
            return false;
        }
        return true;
    },
    errorShake: function(element, error) {
        element.className = 'right';
        setTimeout(function() {
            element.className = 'shake_effect';
            element.focus();
            var errorEle = document.getElementById('error');
            errorEle.innerText = '***' + error + '***';
            document.getElementById('deviceInfo').style.marginTop = '32px';
        }, 1);
    },
    changeModelOption: function(vendorId) {
        var model = document.getElementById('model');
        model.innerHTML = "";
        for (i = 0, len = VendorModel.length; i < len; i++) {
            if (vendorId === VendorModel[i].id) {
                var models = VendorModel[i].models;
                if (models) {
                    for (j = 0, lenj = models.length; j < lenj; j++) {
                        model.appendChild(ModelRepair.createSelectOption(models[j].id, models[j].name, models[j].resTypeId));
                    }
                }
                break;
            }
        }
    },
    initVendorOption: function() {
        var vendorEle = document.getElementById('vendor');
        vendorEle.options.length = 0;
        for (i = 0, len = VendorModel.length; i < len; i++) {
            vendorEle.appendChild(ModelRepair.createSelectOption(VendorModel[i].id, VendorModel[i].name, VendorModel[i].icon));
        }
    },
    initDevTypeOption: function() {
        var devTypeEle = document.getElementById('devType');
        devTypeEle.options.length = 0;
        for (i = 0, len = DevType.length; i < len; i++) {
            devTypeEle.appendChild(ModelRepair.createSelectOption(DevType[i].id, DevType[i].name));
        }

    },
    createSelectOption: function(value, name, extData) {
        var optionElementNode = document.createElement('option');
        optionElementNode.setAttribute('value', value);
        if (extData) {
            optionElementNode.setAttribute('data', extData);
        }
        optionElementNode.innerText = name;
        return optionElementNode;
    },
    generateModelFile: function() {
        if (ModelRepair.validateDevInfo()) {
            var devInfo = ModelRepair.getDevInfo();
            var fileName = devInfo.sysoid.replace(/\./g, '-');
            if (devInfo.sysoid.indexOf('1.3.6.1.4.1') == 0) {
                fileName = devInfo.sysoid.substr(12).replace(/\./g, '-');
            }
            var content = ModelRepair.genModelStr(devInfo);
            var file = new File([content], fileName + ".xml", { type: "text/plain;charset=utf-8" });
            saveAs(file);
            ModelRepair.reloadIndex();
        };
    },
    reloadIndex: function() {
        document.getElementById('sysoid').value = '';
        document.getElementById('modelNumber').value = '';
        document.getElementById('series').value = '';
        document.getElementById('error').innerText = '';
        document.getElementById('deviceInfo').style.marginTop = '55px';
        ModelRepair.init();
    },
    genModelStr: function(deviceInfo) {
        return "<?xml version='1.0' encoding='UTF-8'?>" + "<VendorModel><Vendors><Vendor><Id>" + deviceInfo.id + "</Id><Name>" + deviceInfo.name + "</Name><VendorIcon>" + deviceInfo.icon + "</VendorIcon><ModelSysOIDs><ModelSysOID><ModelId>" + deviceInfo.modelId + "</ModelId><SysOid>" + deviceInfo.sysoid + "</SysOid><Series><![CDATA[" + deviceInfo.series + "]]></Series><ModelNumber><![CDATA[" + deviceInfo.modelNumber + "]]></ModelNumber><MoniTempId>" + deviceInfo.moniTempId + "</MoniTempId><DevType>" + deviceInfo.devType + "</DevType><SortId>" + deviceInfo.sortId + "</SortId></ModelSysOID></ModelSysOIDs></Vendor></Vendors></VendorModel>";
    },
    getDevInfo: function() {
        var DevInfo = {};
        DevInfo.sysoid = document.getElementById('sysoid').value.trim();
        DevInfo.modelNumber = document.getElementById('modelNumber').value.trim();
        DevInfo.series = document.getElementById('series').value.trim();
        var vendorNode = document.getElementById('vendor');
        var vendorOptionNode = vendorNode.options[vendorNode.selectedIndex];
        DevInfo.icon = vendorOptionNode.getAttribute('data');
        DevInfo.id = vendorNode.value;
        DevInfo.name = vendorOptionNode.innerText;
        var modelNode = document.getElementById('model');
        DevInfo.modelId = modelNode.value;
        DevInfo.moniTempId = modelNode.options[modelNode.selectedIndex].getAttribute('data');
        DevInfo.devType = document.getElementById('devType').value;
        DevInfo.sortId = 0
        return DevInfo;
    }
};
ModelRepair.init();
