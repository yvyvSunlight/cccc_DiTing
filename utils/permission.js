import { ref } from 'vue';

/**
 * 判断当前平台是否为 iOS
 */
const isIos = ref(false);
// #ifdef APP-PLUS
isIos.value = plus.os.name === 'iOS';
// #endif

const permission = {
  /**
   * 判断推送权限是否开启（iOS）
   */
  judgeIosPermissionPush() {
    let result = false;
    const UIApplication = plus.ios.import('UIApplication');
    const app = UIApplication.sharedApplication();
    let enabledTypes = 0;

    if (app.currentUserNotificationSettings) {
      const settings = app.currentUserNotificationSettings();
      enabledTypes = settings.plusGetAttribute('types');
      console.log('enabledTypes1:', enabledTypes);
      result = enabledTypes !== 0;
      plus.ios.deleteObject(settings);
    } else {
      enabledTypes = app.enabledRemoteNotificationTypes();
      console.log('enabledTypes2:', enabledTypes);
      result = enabledTypes !== 0;
    }

    plus.ios.deleteObject(app);
    plus.ios.deleteObject(UIApplication);
    console.log(result ? '推送权限已开启' : '推送权限未开启');
    return result;
  },

  /**
   * 判断定位权限是否开启（iOS）
   */
  judgeIosPermissionLocation() {
    const CLLocationManager = plus.ios.import('CLLocationManager');
    const status = CLLocationManager.authorizationStatus();
    const result = status !== 2; // 2 表示未授权
    console.log('定位权限开启：', result);
    plus.ios.deleteObject(CLLocationManager);
    return result;
  },

  /**
   * 判断麦克风权限是否开启（iOS）
   */
  judgeIosPermissionRecord() {
    const AVAudioSession = plus.ios.import('AVAudioSession');
    const avAudio = AVAudioSession.sharedInstance();
    const permissionStatus = avAudio.recordPermission();
    const result = permissionStatus !== 1684369017 && permissionStatus !== 1970168948; // 未授权状态
    console.log(result ? '麦克风权限已开启' : '麦克风权限未开启');
    plus.ios.deleteObject(AVAudioSession);
    return result;
  },

  /**
   * 判断相机权限是否开启（iOS）
   */
  judgeIosPermissionCamera() {
    const AVCaptureDevice = plus.ios.import('AVCaptureDevice');
    const authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
    const result = authStatus === 3; // 3 表示已授权
    console.log(result ? '相机权限已开启' : '相机权限未开启');
    plus.ios.deleteObject(AVCaptureDevice);
    return result;
  },

  /**
   * 判断相册权限是否开启（iOS）
   */
  judgeIosPermissionPhotoLibrary() {
    const PHPhotoLibrary = plus.ios.import('PHPhotoLibrary');
    const authStatus = PHPhotoLibrary.authorizationStatus();
    const result = authStatus === 3; // 3 表示已授权
    console.log(result ? '相册权限已开启' : '相册权限未开启');
    plus.ios.deleteObject(PHPhotoLibrary);
    return result;
  },

  /**
   * 判断通讯录权限是否开启（iOS）
   */
  judgeIosPermissionContact() {
    const CNContactStore = plus.ios.import('CNContactStore');
    const cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
    const result = cnAuthStatus === 3; // 3 表示已授权
    console.log(result ? '通讯录权限已开启' : '通讯录权限未开启');
    plus.ios.deleteObject(CNContactStore);
    return result;
  },

  /**
   * 判断日历权限是否开启（iOS）
   */
  judgeIosPermissionCalendar() {
    const EKEventStore = plus.ios.import('EKEventStore');
    const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
    const result = ekAuthStatus === 3; // 3 表示已授权
    console.log(result ? '日历权限已开启' : '日历权限未开启');
    plus.ios.deleteObject(EKEventStore);
    return result;
  },

  /**
   * 判断备忘录权限是否开启（iOS）
   */
  judgeIosPermissionMemo() {
    const EKEventStore = plus.ios.import('EKEventStore');
    const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
    const result = ekAuthStatus === 3; // 3 表示已授权
    console.log(result ? '备忘录权限已开启' : '备忘录权限未开启');
    plus.ios.deleteObject(EKEventStore);
    return result;
  },

  /**
   * Android 权限查询
   */
  requestAndroidPermission(permissionID) {
    return new Promise((resolve) => {
      plus.android.requestPermissions(
        [permissionID],
        (resultObj) => {
          let result = 0;
          if (resultObj.granted.length > 0) {
            console.log('已获取的权限：', resultObj.granted);
            result = 1;
          } else if (resultObj.deniedPresent.length > 0) {
            console.log('拒绝本次申请的权限：', resultObj.deniedPresent);
            result = 0;
          } else if (resultObj.deniedAlways.length > 0) {
            console.log('永久拒绝申请的权限：', resultObj.deniedAlways);
            result = -1;
          }
          resolve(result);
        },
        (error) => {
          console.log('申请权限错误：', error.code, '=', error.message);
          resolve({ code: error.code, message: error.message });
        }
      );
    });
  },

  /**
   * 跳转到应用的权限设置页面
   */
  gotoAppPermissionSetting() {
    if (isIos.value) {
      const UIApplication = plus.ios.import('UIApplication');
      const application = UIApplication.sharedApplication();
      const NSURL = plus.ios.import('NSURL');
      const setting = NSURL.URLWithString('app-settings:');
      application.openURL(setting);
      plus.ios.deleteObject(setting);
      plus.ios.deleteObject(NSURL);
      plus.ios.deleteObject(application);
    } else {
      const Intent = plus.android.importClass('android.content.Intent');
      const Settings = plus.android.importClass('android.provider.Settings');
      const Uri = plus.android.importClass('android.net.Uri');
      const mainActivity = plus.android.runtimeMainActivity();
      const intent = new Intent();
      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      const uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
      intent.setData(uri);
      mainActivity.startActivity(intent);
    }
  },

  /**
   * 检查系统的设备服务是否开启
   */
  checkSystemEnableLocation() {
    if (isIos.value) {
      const CLLocationManager = plus.ios.import('CLLocationManager');
      const result = CLLocationManager.locationServicesEnabled();
      console.log('系统定位开启:', result);
      plus.ios.deleteObject(CLLocationManager);
      return result;
    } else {
      const Context = plus.android.importClass('android.content.Context');
      const LocationManager = plus.android.importClass('android.location.LocationManager');
      const main = plus.android.runtimeMainActivity();
      const locationService = main.getSystemService(Context.LOCATION_SERVICE);
      const result = locationService.isProviderEnabled(LocationManager.GPS_PROVIDER);
      console.log('系统定位开启:', result);
      return result;
    }
  },
};

export default permission;
