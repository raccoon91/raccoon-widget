interface Device {
  Caption: string;
  CimClass: {
    CimClassMethods: string;
    CimClassProperties: string;
    CimClassQualifiers: string;
    CimSuperClass: string;
    CimSuperClassName: string;
    CimSystemProperties: string;
  };
  CimInstanceProperties: string[];
  CimSystemProperties: {
    ClassName: string;
    Namespace: string;
    Path: string;
    ServerName: string;
  };
  Class: string;
  ClassGuid: string;
  CreationClassName: string;
  Description: string;
  DeviceID: string;
  FriendlyName: string;
  HardwareID: string[];
  InstanceId: string;
  Manufacturer: string;
  Name: string;
  PNPClass: string;
  PNPDeviceID: string;
  Present: boolean;
  Service: string;
  Status: string;
  SystemCreationClassName: string;
  SystemName: string;
}

interface DeviceProperty {
  CimClass: {
    CimClassMethods: string;
    CimClassProperties: string;
    CimClassQualifiers: string;
    CimSuperClass: string;
    CimSuperClassName: string;
    CimSystemProperties: string;
  };
  CimInstanceProperties: string[];
  CimSystemProperties: {
    ClassName: string;
    Namespace: string;
    Path: string | null;
    ServerName: string | null;
  };
  Data: string | string[];
  DeviceID: string;
  InstanceId: string;
  KeyName: string;
  Type: number;
  key: string;
}

interface System {
  CimClass: {
    CimClassMethods: string[];
    CimClassProperties: string[];
    CimClassQualifiers: string[];
    CimSuperClass: {
      CimClassMethod: string;
      CimClassPropertie: string;
      CimClassQualifier: string;
      CimSuperClas: string | null;
      CimSuperClassNam: string | null;
      CimSystemPropertie: string;
    };
    CimSuperClassName: string;
    CimSystemProperties: {
      ClassName: string | null;
      Namespace: string | null;
      Path: string | null;
      ServerName: string | null;
    };
  };
  CimInstanceProperties: {
    CimType: number;
    Flags: string;
    IsValueModified: boolean;
    Name: string;
    Value: string;
  }[];
  CimSystemProperties: {
    ClassName: string;
    Namespace: string;
    Path: string | null;
    ServerName: string | null;
  };
  Data: string;
  DeviceID: string;
  InstanceId: string;
  KeyName: string;
  PSComputerName: string | null;
  Type: number;
  key: string;
}

interface SystemProperty {
  CimClass: {
    CimClassMethods: string;
    CimClassProperties: string;
    CimClassQualifiers: string;
    CimSuperClass: string;
    CimSuperClassName: string;
    CimSystemProperties: string;
  };
  CimInstanceProperties: string[];
  CimSystemProperties: {
    ClassName: string;
    Namespace: string;
    Path: string | null;
    ServerName: string | null;
  };
  Data: string;
  DeviceID: string;
  InstanceId: string;
  KeyName: string;
  PSComputerName: string | null;
  Type: number;
  key: string;
}
