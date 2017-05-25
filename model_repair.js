var ModelRepair = {
    init: function() {
        ModelRepair.appendVendorOption();
        ModelRepair.changeModelOption(document.getElementById('vendor').value);
    },
    validateDevInfo: function() {
        if (!/^\d+(\.\d+)+$/.test(document.getElementById('sysoid').value.trim())) {
            alert("请输入正确的Sysoid!");
            return false;
        }
        if (!document.getElementById('modelNumber').value.trim()) {
            alert("请填写设备型号!");
            return false;
        }
        if (!document.getElementById('series').value.trim()) {
            alert("请填写设备系列号!");
            return false;
        }
        return true;
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
    appendVendorOption: function() {
        var optionArr = [];
        var vendor = document.getElementById('vendor');
        for (i = 0, len = VendorModel.length; i < len; i++) {
            vendor.appendChild(ModelRepair.createSelectOption(VendorModel[i].id, VendorModel[i].name, VendorModel[i].icon));
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
        };
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
