//#region audio/conf.js
const MODULE_NAME = "GODOTSDKManagerHandler";

//#endregion
//#region helper/module-helper.js
var module_helper_default = {
	_send: null,
	init() {
		this._send = GameGlobal.Module.SendMessage;
	},
	send(method, str = "") {
		if (!this._send) this.init();
		this._send(MODULE_NAME, method, str);
	}
};

//#endregion
//#region helper/resType.js
const ResType = {
	AccountInfo: {
		miniProgram: "MiniProgram",
		plugin: "Plugin"
	},
	MiniProgram: {
		appId: "string",
		envVersion: "string",
		version: "string"
	},
	Plugin: {
		appId: "string",
		version: "string"
	},
	AppAuthorizeSetting: {
		albumAuthorized: "string",
		bluetoothAuthorized: "string",
		cameraAuthorized: "string",
		locationAuthorized: "string",
		locationReducedAccuracy: "bool",
		microphoneAuthorized: "string",
		notificationAlertAuthorized: "string",
		notificationAuthorized: "string",
		notificationBadgeAuthorized: "string",
		notificationSoundAuthorized: "string",
		phoneCalendarAuthorized: "string"
	},
	AppBaseInfo: {
		SDKVersion: "string",
		enableDebug: "bool",
		host: "AppBaseInfoHost",
		language: "string",
		version: "string",
		theme: "string"
	},
	AppBaseInfoHost: { appId: "string" },
	GetBatteryInfoSyncResult: {
		isCharging: "bool",
		level: "number"
	},
	DeviceInfo: {
		abi: "string",
		benchmarkLevel: "number",
		brand: "string",
		cpuType: "string",
		deviceAbi: "string",
		memorySize: "string",
		model: "string",
		platform: "string",
		system: "string"
	},
	EnterOptionsGame: {
		apiCategory: "string",
		query: "object",
		referrerInfo: "EnterOptionsGameReferrerInfo",
		scene: "number",
		chatType: "number",
		shareTicket: "string"
	},
	EnterOptionsGameReferrerInfo: {
		appId: "string",
		extraData: "object",
		gameLiveInfo: "GameLiveInfo"
	},
	GameLiveInfo: {
		streamerOpenId: "string",
		feedId: "string"
	},
	LaunchOptionsGame: {
		query: "object",
		referrerInfo: "EnterOptionsGameReferrerInfo",
		scene: "number",
		chatType: "number",
		shareTicket: "string"
	},
	ClientRect: {
		bottom: "number",
		height: "number",
		left: "number",
		right: "number",
		top: "number",
		width: "number"
	},
	GetStorageInfoSyncOption: {
		currentSize: "number",
		keys: "string[]",
		limitSize: "number"
	},
	SystemInfo: {
		SDKVersion: "string",
		albumAuthorized: "bool",
		benchmarkLevel: "number",
		bluetoothEnabled: "bool",
		brand: "string",
		cameraAuthorized: "bool",
		deviceOrientation: "string",
		enableDebug: "bool",
		fontSizeSetting: "number",
		host: "SystemInfoHost",
		language: "string",
		locationAuthorized: "bool",
		locationEnabled: "bool",
		locationReducedAccuracy: "bool",
		microphoneAuthorized: "bool",
		model: "string",
		notificationAlertAuthorized: "bool",
		notificationAuthorized: "bool",
		notificationBadgeAuthorized: "bool",
		notificationSoundAuthorized: "bool",
		phoneCalendarAuthorized: "bool",
		pixelRatio: "number",
		platform: "string",
		safeArea: "SafeArea",
		screenHeight: "number",
		screenWidth: "number",
		statusBarHeight: "number",
		system: "string",
		version: "string",
		wifiEnabled: "bool",
		windowHeight: "number",
		windowWidth: "number",
		theme: "string"
	},
	SystemInfoHost: { appId: "string" },
	SafeArea: {
		bottom: "number",
		height: "number",
		left: "number",
		right: "number",
		top: "number",
		width: "number"
	},
	SystemSetting: {
		bluetoothEnabled: "bool",
		deviceOrientation: "string",
		locationEnabled: "bool",
		wifiEnabled: "bool"
	},
	WindowInfo: {
		pixelRatio: "number",
		safeArea: "SafeArea",
		screenHeight: "number",
		screenTop: "number",
		screenWidth: "number",
		statusBarHeight: "number",
		windowHeight: "number",
		windowWidth: "number"
	},
	GeneralCallbackResult: { errMsg: "string" },
	DownloadFileSuccessCallbackResult: {
		filePath: "string",
		profile: "RequestProfile",
		statusCode: "number",
		tempFilePath: "string",
		errMsg: "string"
	},
	RequestProfile: {
		SSLconnectionEnd: "number",
		SSLconnectionStart: "number",
		connectEnd: "number",
		connectStart: "number",
		domainLookUpEnd: "number",
		domainLookUpStart: "number",
		downstreamThroughputKbpsEstimate: "number",
		estimate_nettype: "number",
		fetchStart: "number",
		httpRttEstimate: "number",
		peerIP: "string",
		port: "number",
		protocol: "string",
		receivedBytedCount: "number",
		redirectEnd: "number",
		redirectStart: "number",
		requestEnd: "number",
		requestStart: "number",
		responseEnd: "number",
		responseStart: "number",
		rtt: "number",
		sendBytesCount: "number",
		socketReused: "bool",
		throughputKbps: "number",
		transportRttEstimate: "number"
	},
	DownloadTaskOnHeadersReceivedListenerResult: { header: "object" },
	DownloadTaskOnProgressUpdateListenerResult: {
		progress: "number",
		totalBytesExpectedToWrite: "number",
		totalBytesWritten: "number"
	},
	CreateOpenSettingButtonOption: {
		style: "OptionStyle",
		type: "string",
		image: "string",
		text: "string"
	},
	OptionStyle: {
		backgroundColor: "string",
		borderColor: "string",
		borderRadius: "number",
		borderWidth: "number",
		color: "string",
		fontSize: "number",
		height: "number",
		left: "number",
		lineHeight: "number",
		textAlign: "string",
		top: "number",
		width: "number"
	},
	ImageData: {
		height: "number",
		width: "number"
	},
	GetLogManagerOption: { level: "number" },
	Path2D: {},
	OnCheckForUpdateListenerResult: { hasUpdate: "bool" },
	VideoDecoderStartOption: {
		source: "string",
		abortAudio: "bool",
		abortVideo: "bool",
		mode: "number"
	},
	SetMessageToFriendQueryOption: {
		query: "string",
		shareMessageToFriendScene: "number"
	},
	AddCardRequestInfo: {
		cardExt: "string",
		cardId: "string"
	},
	AddCardSuccessCallbackResult: {
		cardList: "AddCardResponseInfo[]",
		errMsg: "string"
	},
	AddCardResponseInfo: {
		cardExt: "string",
		cardId: "string",
		code: "string",
		isSuccess: "bool"
	},
	AuthPrivateMessageSuccessCallbackResult: {
		encryptedData: "string",
		errMsg: "string",
		iv: "string",
		valid: "bool"
	},
	CheckIsAddedToMyMiniProgramSuccessCallbackResult: {
		added: "bool",
		errMsg: "string"
	},
	ChooseImageSuccessCallbackResult: {
		tempFilePaths: "string[]",
		tempFiles: "ImageFile[]",
		errMsg: "string"
	},
	ImageFile: {
		path: "string",
		size: "number"
	},
	ChooseMediaSuccessCallbackResult: {
		tempFiles: "MediaFile[]",
		type: "string",
		errMsg: "string"
	},
	MediaFile: {
		duration: "number",
		fileType: "string",
		height: "number",
		size: "number",
		tempFilePath: "string",
		thumbTempFilePath: "string",
		width: "number"
	},
	ChooseMessageFileSuccessCallbackResult: {
		tempFiles: "ChooseFile[]",
		errMsg: "string"
	},
	ChooseFile: {
		name: "string",
		path: "string",
		size: "number",
		time: "number",
		type: "string"
	},
	BluetoothError: {
		errMsg: "string",
		errCode: "number"
	},
	CompressImageSuccessCallbackResult: {
		tempFilePath: "string",
		errMsg: "string"
	},
	CreateBLEPeripheralServerSuccessCallbackResult: {
		server: "BLEPeripheralServer",
		errMsg: "string"
	},
	BLEPeripheralService: {
		characteristics: "Characteristic[]",
		uuid: "string"
	},
	Characteristic: {
		uuid: "string",
		descriptors: "Descriptor[]",
		permission: "CharacteristicPermission",
		properties: "CharacteristicProperties",
		value: "arrayBuffer",
		arrayBufferLength: "number"
	},
	Descriptor: {
		uuid: "string",
		permission: "DescriptorPermission",
		value: "arrayBuffer",
		arrayBufferLength: "number"
	},
	DescriptorPermission: {
		read: "bool",
		write: "bool"
	},
	CharacteristicPermission: {
		readEncryptionRequired: "bool",
		readable: "bool",
		writeEncryptionRequired: "bool",
		writeable: "bool"
	},
	CharacteristicProperties: {
		indicate: "bool",
		notify: "bool",
		read: "bool",
		write: "bool",
		writeNoResponse: "bool"
	},
	OnCharacteristicReadRequestListenerResult: {
		callbackId: "number",
		characteristicId: "string",
		serviceId: "string"
	},
	OnCharacteristicSubscribedListenerResult: {
		characteristicId: "string",
		serviceId: "string"
	},
	OnCharacteristicWriteRequestListenerResult: {
		callbackId: "number",
		characteristicId: "string",
		serviceId: "string",
		value: "arrayBuffer",
		arrayBufferLength: "number"
	},
	AdvertiseReqObj: {
		beacon: "BeaconInfoObj",
		connectable: "bool",
		deviceName: "string",
		manufacturerData: "ManufacturerData[]",
		serviceUuids: "string[]"
	},
	BeaconInfoObj: {
		major: "number",
		minor: "number",
		uuid: "string",
		measuredPower: "number"
	},
	ManufacturerData: {
		manufacturerId: "string",
		manufacturerSpecificData: "arrayBuffer",
		arrayBufferLength: "number"
	},
	FaceDetectSuccessCallbackResult: {
		angleArray: "FaceAngel",
		confArray: "FaceConf",
		detectRect: "object",
		faceInfo: "IAnyObject[]",
		pointArray: "IAnyObject[]",
		x: "number",
		y: "number",
		errMsg: "string"
	},
	FaceAngel: {
		pitch: "number",
		roll: "number",
		yaw: "number"
	},
	FaceConf: {
		global: "number",
		leftEye: "number",
		mouth: "number",
		nose: "number",
		rightEye: "number"
	},
	GetAvailableAudioSourcesSuccessCallbackResult: { errMsg: "string" },
	GetBLEDeviceCharacteristicsSuccessCallbackResult: {
		characteristics: "BLECharacteristic[]",
		errMsg: "string"
	},
	BLECharacteristic: {
		properties: "BLECharacteristicProperties",
		uuid: "string"
	},
	BLECharacteristicProperties: {
		indicate: "bool",
		notify: "bool",
		read: "bool",
		write: "bool",
		writeDefault: "bool",
		writeNoResponse: "bool"
	},
	GetBLEDeviceRSSISuccessCallbackResult: {
		RSSI: "number",
		errMsg: "string"
	},
	GetBLEDeviceServicesSuccessCallbackResult: {
		services: "BLEService[]",
		errMsg: "string"
	},
	BLEService: {
		isPrimary: "bool",
		uuid: "string"
	},
	GetBLEMTUSuccessCallbackResult: {
		mtu: "number",
		errMsg: "string"
	},
	GetBackgroundFetchDataSuccessCallbackResult: {
		fetchedData: "string",
		path: "string",
		query: "string",
		scene: "number",
		timeStamp: "long",
		errMsg: "string"
	},
	GetBackgroundFetchTokenSuccessCallbackResult: {
		errMsg: "string",
		token: "string"
	},
	GetBatteryInfoSuccessCallbackResult: {
		isCharging: "bool",
		level: "number",
		errMsg: "string"
	},
	BeaconError: {
		errMsg: "string",
		errCode: "number"
	},
	GetBeaconsSuccessCallbackResult: {
		beacons: "BeaconInfo[]",
		errMsg: "string"
	},
	BeaconInfo: {
		accuracy: "number",
		major: "number",
		minor: "number",
		proximity: "number",
		rssi: "number",
		uuid: "string"
	},
	GetBluetoothAdapterStateSuccessCallbackResult: {
		available: "bool",
		discovering: "bool",
		errMsg: "string"
	},
	GetBluetoothDevicesSuccessCallbackResult: {
		devices: "BlueToothDevice[]",
		errMsg: "string"
	},
	BlueToothDevice: {
		RSSI: "number",
		advertisData: "arrayBuffer",
		arrayBufferLength: "number",
		advertisServiceUUIDs: "string[]",
		connectable: "bool",
		deviceId: "string",
		localName: "string",
		name: "string",
		serviceData: "object"
	},
	GetChannelsLiveInfoSuccessCallbackResult: {
		description: "string",
		feedId: "string",
		headUrl: "string",
		nickname: "string",
		nonceId: "string",
		otherInfos: "AnyKeyword[]",
		replayStatus: "number",
		status: "number",
		errMsg: "string"
	},
	GetChannelsLiveNoticeInfoSuccessCallbackResult: {
		headUrl: "string",
		nickname: "string",
		noticeId: "string",
		otherInfos: "AnyKeyword[]",
		reservable: "bool",
		startTime: "string",
		status: "number",
		errMsg: "string"
	},
	GetClipboardDataSuccessCallbackOption: {
		data: "string",
		errMsg: "string"
	},
	GetConnectedBluetoothDevicesSuccessCallbackResult: {
		devices: "BluetoothDeviceInfo[]",
		errMsg: "string"
	},
	BluetoothDeviceInfo: {
		deviceId: "string",
		name: "string"
	},
	GetExtConfigSuccessCallbackResult: {
		extConfig: "object",
		errMsg: "string"
	},
	GetFuzzyLocationSuccessCallbackResult: {
		latitude: "number",
		longitude: "number",
		errMsg: "string"
	},
	DataType: {
		type: "number",
		subKey: "string"
	},
	GetGameClubDataSuccessCallbackResult: {
		cloudID: "string",
		encryptedData: "string",
		iv: "string",
		signature: "string",
		errMsg: "string"
	},
	GetGroupEnterInfoSuccessCallbackResult: {
		cloudID: "string",
		encryptedData: "string",
		errMsg: "string",
		iv: "string"
	},
	GetInferenceEnvInfoSuccessCallbackResult: {
		ver: "string",
		errMsg: "string"
	},
	GetLocalIPAddressSuccessCallbackResult: {
		errMsg: "string",
		localip: "string",
		netmask: "string"
	},
	GetNetworkTypeSuccessCallbackResult: {
		hasSystemProxy: "bool",
		networkType: "string",
		signalStrength: "number",
		errMsg: "string"
	},
	GetPrivacySettingSuccessCallbackResult: {
		needAuthorization: "bool",
		privacyContractName: "string",
		errMsg: "string"
	},
	GetScreenBrightnessSuccessCallbackOption: {
		value: "number",
		errMsg: "string"
	},
	GetScreenRecordingStateSuccessCallbackResult: {
		state: "string",
		errMsg: "string"
	},
	GetSettingSuccessCallbackResult: {
		authSetting: "AuthSetting",
		subscriptionsSetting: "SubscriptionsSetting",
		miniprogramAuthSetting: "AuthSetting",
		errMsg: "string"
	},
	AuthSetting: {},
	SubscriptionsSetting: {
		mainSwitch: "bool",
		itemSettings: "object"
	},
	GetStorageInfoSuccessCallbackOption: {
		currentSize: "number",
		keys: "string[]",
		limitSize: "number",
		errMsg: "string"
	},
	GetUserInfoSuccessCallbackResult: {
		cloudID: "string",
		encryptedData: "string",
		iv: "string",
		rawData: "string",
		signature: "string",
		userInfo: "UserInfo",
		errMsg: "string"
	},
	UserInfo: {
		avatarUrl: "string",
		city: "string",
		country: "string",
		gender: "number",
		language: "string",
		nickName: "string",
		province: "string"
	},
	GetUserInteractiveStorageFailCallbackResult: {
		errCode: "number",
		errMsg: "string"
	},
	GetUserInteractiveStorageSuccessCallbackResult: {
		cloudID: "string",
		encryptedData: "string",
		iv: "string",
		errMsg: "string"
	},
	GetWeRunDataSuccessCallbackResult: {
		cloudID: "string",
		encryptedData: "string",
		iv: "string",
		errMsg: "string"
	},
	JoinVoIPChatError: {
		errMsg: "string",
		errCode: "number"
	},
	MuteConfig: {
		muteEarphone: "bool",
		muteMicrophone: "bool"
	},
	JoinVoIPChatSuccessCallbackResult: {
		errCode: "number",
		errMsg: "string",
		openIdList: "string[]"
	},
	RequestFailCallbackErr: {
		errMsg: "string",
		errno: "number"
	},
	LoginSuccessCallbackResult: {
		code: "string",
		errMsg: "string"
	},
	OnAccelerometerChangeListenerResult: {
		x: "number",
		y: "number",
		z: "number"
	},
	OnAddToFavoritesListenerResult: {
		disableForward: "bool",
		imageUrl: "string",
		query: "string",
		title: "string"
	},
	OnBLEConnectionStateChangeListenerResult: {
		connected: "bool",
		deviceId: "string"
	},
	OnBLEMTUChangeListenerResult: {
		deviceId: "string",
		mtu: "number"
	},
	OnBLEPeripheralConnectionStateChangedListenerResult: {
		connected: "bool",
		deviceId: "string",
		serverId: "string"
	},
	OnBackgroundFetchDataListenerResult: {
		fetchType: "string",
		fetchedData: "string",
		path: "string",
		query: "string",
		scene: "number",
		timeStamp: "long"
	},
	OnBeaconServiceChangeListenerResult: {
		available: "bool",
		discovering: "bool"
	},
	OnBeaconUpdateListenerResult: { beacons: "BeaconInfo[]" },
	OnBluetoothAdapterStateChangeListenerResult: {
		available: "bool",
		discovering: "bool"
	},
	OnBluetoothDeviceFoundListenerResult: { devices: "BlueToothDevice[]" },
	OnCompassChangeListenerResult: {
		accuracy: "string",
		direction: "number"
	},
	OnCopyUrlListenerResult: { query: "string" },
	OnDeviceMotionChangeListenerResult: {
		alpha: "number",
		beta: "number",
		gamma: "number"
	},
	OnDeviceOrientationChangeListenerResult: { value: "string" },
	Error: {
		message: "string",
		stack: "string"
	},
	OnHandoffListenerResult: { query: "string" },
	OnKeyDownListenerResult: {
		code: "string",
		key: "string",
		timeStamp: "long"
	},
	OnKeyboardInputListenerResult: { value: "string" },
	OnKeyboardHeightChangeListenerResult: { height: "number" },
	OnMemoryWarningListenerResult: { level: "number" },
	OnMouseDownListenerResult: {
		button: "number",
		timeStamp: "long",
		x: "number",
		y: "number"
	},
	OnMouseMoveListenerResult: {
		movementX: "number",
		movementY: "number",
		timeStamp: "long",
		x: "number",
		y: "number"
	},
	OnNetworkStatusChangeListenerResult: {
		isConnected: "bool",
		networkType: "string"
	},
	OnNetworkWeakChangeListenerResult: {
		networkType: "string",
		weakNet: "bool"
	},
	OnScreenRecordingStateChangedListenerResult: { state: "string" },
	OnShareTimelineListenerResult: {
		imageUrl: "string",
		imagePreviewUrl: "string",
		imagePreviewUrlId: "string",
		imageUrlId: "string",
		path: "string",
		query: "string",
		title: "string"
	},
	OnShowListenerResult: {
		query: "object",
		referrerInfo: "ResultReferrerInfo",
		scene: "number",
		chatType: "number",
		shareTicket: "string"
	},
	ResultReferrerInfo: {
		appId: "string",
		extraData: "object"
	},
	OnUnhandledRejectionListenerResult: {
		promise: "string",
		reason: "string"
	},
	OnVoIPChatInterruptedListenerResult: {
		errCode: "number",
		errMsg: "string"
	},
	OnVoIPChatMembersChangedListenerResult: {
		errCode: "number",
		errMsg: "string",
		openIdList: "string[]"
	},
	OnVoIPChatSpeakersChangedListenerResult: {
		errCode: "number",
		errMsg: "string",
		openIdList: "string[]"
	},
	OnVoIPChatStateChangedListenerResult: {
		code: "number",
		data: "object",
		errCode: "number",
		errMsg: "string"
	},
	OnWheelListenerResult: {
		deltaX: "number",
		deltaY: "number",
		deltaZ: "number",
		timeStamp: "long",
		x: "number",
		y: "number"
	},
	OnWindowResizeListenerResult: {
		windowHeight: "number",
		windowWidth: "number"
	},
	OpenCardRequestInfo: {
		cardId: "string",
		code: "string"
	},
	ExtInfoOption: { url: "string" },
	OpenCustomerServiceConversationSuccessCallbackResult: {
		path: "string",
		query: "object",
		errMsg: "string"
	},
	OpenSettingSuccessCallbackResult: {
		authSetting: "AuthSetting",
		subscriptionsSetting: "SubscriptionsSetting",
		errMsg: "string"
	},
	OperateGameRecorderVideoOption: {
		atempo: "number",
		audioMix: "bool",
		bgm: "string",
		desc: "string",
		path: "string",
		query: "string",
		timeRange: "number[]",
		title: "string",
		volume: "number"
	},
	MediaSource: {
		url: "string",
		poster: "string",
		type: "string"
	},
	ReportSceneError: {
		errMsg: "string",
		errCode: "number"
	},
	ReportSceneFailCallbackErr: {
		data: "object",
		errMsg: "string"
	},
	ReportSceneSuccessCallbackResult: {
		data: "object",
		errMsg: "string"
	},
	ReportUserBehaviorBranchAnalyticsOption: {
		branchId: "string",
		eventType: "number",
		branchDim: "string"
	},
	MidasFriendPaymentError: {
		errMsg: "string",
		errCode: "number"
	},
	RequestMidasFriendPaymentSuccessCallbackResult: {
		cloudID: "string",
		encryptedData: "string",
		errMsg: "string",
		iv: "string"
	},
	MidasPaymentError: {
		errMsg: "string",
		errCode: "number"
	},
	RequestMidasPaymentFailCallbackErr: {
		errCode: "number",
		errMsg: "string"
	},
	RequestMidasPaymentSuccessCallbackResult: { errMsg: "string" },
	RequestSubscribeMessageFailCallbackResult: {
		errCode: "number",
		errMsg: "string"
	},
	RequestSubscribeMessageSuccessCallbackResult: {
		anyKeyWord: "string",
		errMsg: "string"
	},
	RequestSubscribeSystemMessageSuccessCallbackResult: {
		anyKeyWord: "string",
		errMsg: "string"
	},
	ReserveChannelsLiveOption: { noticeId: "string" },
	ScanCodeSuccessCallbackResult: {
		charSet: "string",
		path: "string",
		rawData: "string",
		result: "string",
		scanType: "string",
		errMsg: "string"
	},
	SetBLEMTUFailCallbackResult: { mtu: "number" },
	SetBLEMTUSuccessCallbackResult: {
		mtu: "number",
		errMsg: "string"
	},
	KVData: {
		key: "string",
		value: "string"
	},
	ShareAppMessageOption: {
		imageUrl: "string",
		imageUrlId: "string",
		path: "string",
		query: "string",
		title: "string",
		toCurrentGroup: "bool"
	},
	ShowActionSheetSuccessCallbackResult: {
		tapIndex: "number",
		errMsg: "string"
	},
	ShowModalSuccessCallbackResult: {
		cancel: "bool",
		confirm: "bool",
		content: "string",
		errMsg: "string"
	},
	UpdatableMessageFrontEndTemplateInfo: { parameterList: "UpdatableMessageFrontEndParameter[]" },
	UpdatableMessageFrontEndParameter: {
		name: "string",
		value: "string"
	},
	VibrateShortFailCallbackResult: { errMsg: "string" },
	CheckGameLiveEnabledSuccessCallbackOption: {
		errMsg: "string",
		isEnabled: "bool"
	},
	OnGameLiveStateChangeCallbackResult: {
		state: "string",
		feedId: "string"
	},
	OnGameLiveStateChangeCallbackResponse: { query: "string" },
	GameLiveState: { isLive: "bool" },
	GetUserCurrentGameliveInfoSuccessCallbackOption: { feedIdList: "string[]" },
	GetUserGameLiveDetailsSuccessCallbackOption: {
		encryptedData: "string",
		iv: "string",
		cloudID: "string",
		feedIdList: "string[]",
		errMsg: "string"
	},
	MidasPaymentGameItemError: {
		errMsg: "string",
		errCode: "number"
	},
	RequestSubscribeLiveActivitySuccessCallbackResult: {
		code: "string",
		errMsg: "string"
	},
	FrameDataOptions: {
		data: "arrayBuffer",
		arrayBufferLength: "number",
		height: "number",
		pkDts: "number",
		pkPts: "number",
		width: "number"
	}
};

//#endregion
//#region helper/resTypeOther.js
const ResTypeOther = {
	Stats: {
		lastAccessedTime: "number",
		lastModifiedTime: "number",
		mode: "number",
		size: "number"
	},
	TCPSocketOnMessageListenerResult: {
		localInfo: "LocalInfo",
		message: "arrayBuffer",
		remoteInfo: "RemoteInfo"
	},
	LocalInfo: {
		address: "string",
		family: "string",
		port: "number"
	},
	RemoteInfo: {
		address: "string",
		family: "string",
		port: "number"
	},
	UDPSocketConnectOption: {
		address: "string",
		port: "number"
	},
	UDPSocketOnMessageListenerResult: {
		localInfo: "LocalInfo",
		message: "arrayBuffer",
		remoteInfo: "RemoteInfo"
	},
	UDPSocketSendOption: {
		address: "string",
		message: "string|arrayBuffer",
		port: "number",
		length: "number",
		offset: "number",
		setBroadcast: "bool"
	},
	UDPSocketSendParam: {
		address: "string",
		port: "number",
		length: "number",
		offset: "number",
		setBroadcast: "bool"
	}
};

//#endregion
//#region helper/utils.js
let utils = { cloneMethod(target, origin, methodName, targetMethodName) {
	if (origin[methodName]) {
		targetMethodName = targetMethodName || methodName;
		target[targetMethodName] = origin[methodName].bind(origin);
	}
} };
Object.assign(ResType, ResTypeOther);
function realUid(length = 20, char = true) {
	const soup = `${char ? "" : "!#%()*+,-./:;=?@[]^_`{|}~"}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
	const soupLength = soup.length;
	const id = [];
	for (let i = 0; i < length; i++) id[i] = soup.charAt(Math.random() * soupLength);
	return id.join("");
}
const uid = () => realUid(20, true);
var utils_default = utils;

//#endregion
//#region helper/check-version.js
const { version, SDKVersion, platform, system } = wx.getSystemInfoSync();
const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo?.miniProgram?.envVersion;
function compareVersion(v1, v2) {
	if (!v1 || !v2) return false;
	return v1.split(".").map((v) => v.padStart(2, "0")).join("") >= v2.split(".").map((v) => v.padStart(2, "0")).join("");
}
const isPc = platform === "windows" || platform === "mac";
const isIOS = platform === "ios";
const isAndroid = platform === "android";
const isDevtools = platform === "devtools";
const isMobile = !isPc && !isDevtools;
const isDevelop = envVersion === "develop";
const $LOAD_DATA_FROM_SUBPACKAGE = true;
const $IOS_DEVICE_PIXEL_RATIO = 1;
const isH5Renderer = GameGlobal.isIOSHighPerformanceMode;
const systemVersionArr = system ? system.split(" ") : [];
const systemVersion = systemVersionArr.length ? systemVersionArr[systemVersionArr.length - 1] : "";
const isPcWeChatVersionValid = compareVersion(version, "3.3");
const isLibVersionValid = compareVersion(SDKVersion, "2.17.0");
const isH5LibVersionValid = compareVersion(SDKVersion, "2.23.1");
const isIOSH5SystemVersionValid = compareVersion(systemVersion, "14.0");
const isIOSWebgl2SystemVersionValid = compareVersion(systemVersion, "15.0") || GameGlobal.isIOSHighPerformanceModePlus;
const isAndroidWebGL2ClientVersionValid = compareVersion(version, "8.0.19");
const isSupportBufferURL = !isPc && (isH5Renderer ? compareVersion(SDKVersion, "2.29.1") && compareVersion(version, "8.0.30") : typeof wx.createBufferURL === "function");
const isSupportPlayBackRate = !isAndroid || compareVersion(version, "8.0.23");
const isSupportCacheAudio = !isIOS || compareVersion(version, "8.0.31");
const isSupportInnerAudio = compareVersion(version, "8.0.38");
const isPcBrotliInvalid = isPc && !compareVersion(SDKVersion, $LOAD_DATA_FROM_SUBPACKAGE ? "2.29.2" : "2.32.3");
const isMobileBrotliInvalid = isMobile && !compareVersion(SDKVersion, "2.21.1");
GameGlobal.canUseH5Renderer = isH5Renderer && isH5LibVersionValid;
GameGlobal.canUseiOSAutoGC = isH5Renderer && compareVersion(SDKVersion, "2.32.1");
const isSupportVideoPlayer = isIOS && compareVersion(SDKVersion, "3.1.1") || isAndroid && compareVersion(SDKVersion, "3.0.0") || (isPc || isDevtools) && compareVersion(SDKVersion, "3.2.1");
const webAudioNeedResume = compareVersion(SDKVersion, "2.25.3") && isH5Renderer;
const needToastEnableHpMode = isDevelop && isIOS && isH5LibVersionValid && isIOSH5SystemVersionValid && !isH5Renderer;
if (needToastEnableHpMode) console.error("此AppID未开通高性能模式\n请前往mp后台-能力地图-开发提效包-高性能模式开通\n可大幅提升游戏运行性能");
if (isIOS && typeof $IOS_DEVICE_PIXEL_RATIO === "number" && $IOS_DEVICE_PIXEL_RATIO > 0) window.devicePixelRatio = $IOS_DEVICE_PIXEL_RATIO;
else if (isPc) try {
	if (window.devicePixelRatio < 2) window.devicePixelRatio = 2;
} catch (e) {
	console.warn(e);
}

//#endregion
//#region audio/store.js
const WEBAudio = {
	audioInstanceIdCounter: 0,
	audioInstances: {},
	audioContext: null,
	audioWebEnabled: 0,
	audioCache: [],
	lOrientation: {
		x: 0,
		y: 0,
		z: 0,
		xUp: 0,
		yUp: 0,
		zUp: 0
	},
	lPosition: {
		x: 0,
		y: 0,
		z: 0
	},
	audio3DSupport: 0,
	audioWebSupport: 0,
	bufferSourceNodeLength: 0,
	audioBufferLength: 0,
	isMute: false,
	FAKEMOD_SAMPLERATE: 44100
};
const audios = {};
const localAudioMap = {};
const downloadingAudioMap = {};
const godotAudioVolume = /* @__PURE__ */ new WeakMap();
const innerAudioVolume = /* @__PURE__ */ new WeakMap();

//#endregion
//#region audio/const.js
const INNER_AUDIO_UNDEFINED_MSG = "InnerAudioContext does not exist!";
const IGNORE_ERROR_MSG = "audio is playing, don't play again";
const TEMP_DIR_PATH = `${wx.env.USER_DATA_PATH}/__GAME_FILE_CACHE/audios`;

//#endregion
//#region audio/utils.js
const resumeWebAudio = () => {
	WEBAudio.audioContext?.resume();
};
const createInnerAudio = () => {
	const id = uid();
	const audio = isSupportCacheAudio && WEBAudio.audioCache.length ? WEBAudio.audioCache.shift() : wx.createInnerAudioContext();
	if (audio) audios[id] = audio;
	return {
		id,
		audio
	};
};
const destroyInnerAudio = (id, useCache) => {
	if (!id) return;
	if (!useCache || !isSupportCacheAudio || WEBAudio.audioCache.length > 32) audios[id].destroy();
	else {
		[
			"Play",
			"Pause",
			"Stop",
			"Canplay",
			"Error",
			"Ended",
			"Waiting",
			"Seeking",
			"Seeked",
			"TimeUpdate"
		].forEach((eventName) => {
			audios[id][`off${eventName}`]();
		});
		const state = {
			startTime: 0,
			obeyMuteSwitch: true,
			volume: 1,
			autoplay: false,
			loop: false,
			referrerPolicy: ""
		};
		Object.keys(state).forEach((key) => {
			try {
				audios[id][key] = state[key];
			} catch (e) {}
		});
		audios[id].stop();
		const cacheAudio = audios[id];
		setTimeout(() => {
			WEBAudio.audioCache.push(cacheAudio);
		}, 1e3);
	}
	delete audios[id];
};
const printErrMsg = (msg) => {
	GameGlobal.manager.printErr(msg);
};
function mkCacheDir() {
	const fs = wx.getFileSystemManager();
	fs.rmdir({
		dirPath: TEMP_DIR_PATH,
		recursive: true,
		complete: () => {
			fs.mkdir({ dirPath: TEMP_DIR_PATH });
		}
	});
}

//#endregion
//#region audio/inner-audio.js
const funs = {
	getFullUrl(v) {
		if (!/^https?:\/\//.test(v) && !/^wxfile:\/\//.test(v)) {
			const cdnPath = GameGlobal.manager.assetPath;
			v = `${cdnPath.replace(/\/$/, "")}/${v.replace(/^\//, "").replace(/^Assets\//, "")}`;
		}
		return v;
	},
	downloadAudios(paths) {
		const list = paths.split(",");
		return Promise.all(list.map((v) => {
			const src = funs.getFullUrl(v);
			return new Promise((resolve, reject) => {
				if (!downloadingAudioMap[src]) {
					downloadingAudioMap[src] = [{
						resolve,
						reject
					}];
					if (funs.checkLocalFile(src)) funs.handleDownloadEnd(src, true);
					else if (!GameGlobal.GODOTSDK.isCacheableFile(src)) wx.downloadFile({
						url: src,
						success(res) {
							if (res.statusCode === 200 && res.tempFilePath) {
								localAudioMap[src] = res.tempFilePath;
								funs.handleDownloadEnd(src, true);
							} else funs.handleDownloadEnd(src, false);
						},
						fail(e) {
							funs.handleDownloadEnd(src, false);
							printErrMsg(e);
						}
					});
					else {
						const xmlhttp = new GameGlobal.GODOTSDK.XMLHttpRequest();
						xmlhttp.open("GET", src, true);
						xmlhttp.responseType = "arraybuffer";
						xmlhttp.onsave = () => {
							localAudioMap[src] = GameGlobal.manager.getCachePath(src);
							funs.handleDownloadEnd(src, true);
						};
						xmlhttp.onsavefail = () => {
							funs.handleDownloadEnd(src, false);
						};
						xmlhttp.onerror = () => {
							funs.handleDownloadEnd(src, false);
						};
						xmlhttp.send();
					}
				} else downloadingAudioMap[src].push({
					resolve,
					reject
				});
			});
		}));
	},
	handleDownloadEnd(src, succeeded) {
		if (!downloadingAudioMap[src]) return;
		while (downloadingAudioMap[src] && downloadingAudioMap[src].length > 0) {
			const item = downloadingAudioMap[src].shift();
			if (!succeeded) item?.reject();
			else item?.resolve("");
		}
		delete downloadingAudioMap[src];
	},
	checkLocalFile(src) {
		if (localAudioMap[src]) return true;
		const path = GameGlobal.manager.getCachePath(src);
		if (path) {
			localAudioMap[src] = path;
			return true;
		}
		return false;
	},
	setAudioSrc(audio, getSrc) {
		return new Promise((resolve, reject) => {
			const src = funs.getFullUrl(getSrc);
			audio.isLoading = src;
			if (funs.checkLocalFile(src)) {
				audio.src = localAudioMap[src];
				delete audio.isLoading;
				funs.handleDownloadEnd(src, true);
				resolve(localAudioMap[src]);
			} else if (audio.needDownload) funs.downloadAudios(src).then(() => {
				if (audio) {
					audio.src = localAudioMap[src];
					delete audio.isLoading;
					resolve(localAudioMap[src]);
				} else {
					console.warn("资源已被删除:", src);
					reject({
						errCode: -1,
						errMsg: "资源已被删除"
					});
				}
			}).catch(() => {
				console.warn("资源下载失败:", src);
				if (audio) {
					audio.src = src;
					delete audio.isLoading;
				}
				reject({
					errCode: -1,
					errMsg: "资源下载失败"
				});
			});
			else {
				audio.src = src;
				delete audio.isLoading;
				resolve(src);
			}
		});
	}
};
function checkHasAudio(id) {
	if (audios[id]) return true;
	console.error(INNER_AUDIO_UNDEFINED_MSG, id);
	return false;
}
var inner_audio_default = {
	WXCreateInnerAudioContext(src, loop, startTime, autoplay, volume, playbackRate, needDownload) {
		const { audio: getAudio, id } = createInnerAudio();
		getAudio.needDownload = needDownload;
		if (src) funs.setAudioSrc(getAudio, src).catch((e) => {
			module_helper_default.send("OnAudioCallback", JSON.stringify({
				callbackId: id,
				errMsg: "onError",
				result: JSON.stringify(e)
			}));
		});
		if (loop) getAudio.loop = true;
		if (autoplay) getAudio.autoplay = true;
		if (typeof startTime === "undefined") startTime = 0;
		if (startTime > 0) getAudio.startTime = +startTime.toFixed(2);
		let volumeValue;
		if (typeof volume === "undefined") volumeValue = 1;
		else volumeValue = +volume.toFixed(2);
		innerAudioVolume.set(getAudio, volumeValue);
		if (WEBAudio.isMute) volumeValue = 0;
		if (volumeValue !== 1) getAudio.volume = volumeValue;
		if (!isSupportPlayBackRate) playbackRate = 1;
		if (typeof playbackRate !== "undefined" && playbackRate !== 1) getAudio.playbackRate = +playbackRate.toFixed(2);
		return id;
	},
	WXInnerAudioContextSetBool(id, k, v) {
		if (!checkHasAudio(id)) return;
		audios[id][k] = Boolean(+v);
	},
	WXInnerAudioContextSetString(id, k, v) {
		if (!checkHasAudio(id)) return;
		if (k === "src") funs.setAudioSrc(audios[id], v);
		else if (k === "needDownload") audios[id].needDownload = !!v;
		else audios[id][k] = v;
	},
	WXInnerAudioContextSetFloat(id, k, v) {
		if (!checkHasAudio(id)) return;
		let value = +v.toFixed(2);
		if (k === "volume") {
			innerAudioVolume.set(audios[id], value);
			if (WEBAudio.isMute) value = 0;
		}
		audios[id][k] = value;
	},
	WXInnerAudioContextGetFloat(id, k) {
		if (!checkHasAudio(id)) return 0;
		return audios[id][k];
	},
	WXInnerAudioContextGetBool(id, k) {
		if (!checkHasAudio(id)) return false;
		return audios[id][k];
	},
	WXInnerAudioContextPlay(id) {
		if (!checkHasAudio(id)) return;
		const url = audios[id].isLoading;
		if (url) if (downloadingAudioMap[url]) downloadingAudioMap[url].push({
			resolve: () => {
				if (typeof audios[id] !== "undefined") audios[id].play();
			},
			reject: () => {}
		});
		else {
			audios[id].src = url;
			audios[id].play();
		}
		else audios[id].play();
	},
	WXInnerAudioContextPause(id) {
		if (!checkHasAudio(id)) return;
		audios[id].pause();
	},
	WXInnerAudioContextStop(id) {
		if (!checkHasAudio(id)) return;
		audios[id].stop();
	},
	WXInnerAudioContextDestroy(id) {
		if (!checkHasAudio(id)) return;
		destroyInnerAudio(id, false);
	},
	WXInnerAudioContextSeek(id, position) {
		if (!checkHasAudio(id)) return;
		audios[id].seek(+position.toFixed(3));
	},
	WXInnerAudioContextAddListener(id, key) {
		if (!checkHasAudio(id)) return;
		if (key === "onCanplay") audios[id][key](() => {
			const { duration, buffered, referrerPolicy, volume } = audios[id];
			setTimeout(() => {
				module_helper_default.send("OnAudioCallback", JSON.stringify({
					callbackId: id,
					errMsg: key
				}));
			}, 0);
		});
		else if (key === "onError") audios[id][key]((e) => {
			if (key === "onError") {
				console.error(e);
				if (e.errMsg && e.errMsg.indexOf(IGNORE_ERROR_MSG) > -1) return;
			}
			module_helper_default.send("OnAudioCallback", JSON.stringify({
				callbackId: id,
				errMsg: key,
				result: JSON.stringify(e)
			}));
		});
		else audios[id][key](() => {
			module_helper_default.send("OnAudioCallback", JSON.stringify({
				callbackId: id,
				errMsg: key
			}));
		});
	},
	WXInnerAudioContextRemoveListener(id, key) {
		if (!checkHasAudio(id)) return;
		audios[id][key]();
	},
	WXPreDownloadAudios(paths, id) {
		funs.downloadAudios(paths).then(() => {
			module_helper_default.send("WXPreDownloadAudiosCallback", JSON.stringify({
				callbackId: id.toString(),
				errMsg: "0"
			}));
		}).catch(() => {
			module_helper_default.send("WXPreDownloadAudiosCallback", JSON.stringify({
				callbackId: id.toString(),
				errMsg: "1"
			}));
		});
	}
};

//#endregion
//#region audio/godot-audio.js
const defaultSoundLength = 441e3;
function jsAudioCreateUncompressedSoundClip(buffer, error, length) {
	const soundClip = {
		buffer,
		error,
		release() {
			this.buffer = null;
			WEBAudio.audioBufferLength -= length;
		},
		getLength() {
			if (!this.buffer) return 0;
			const sampleRateRatio = 44100 / this.buffer.sampleRate;
			return this.buffer.length * sampleRateRatio;
		},
		getData(ptr, length$1) {
			if (!this.buffer) {
				console.log("Trying to get data of sound which is not loaded.");
				return 0;
			}
			const startOutputBuffer = ptr >> 2;
			const output = "";
			const numMaxSamples = Math.floor((length$1 >> 2) / this.buffer.numberOfChannels);
			const numReadSamples = Math.min(this.buffer.length, numMaxSamples);
			for (let i = 0; i < this.buffer.numberOfChannels; i++) {
				const channelData = this.buffer.getChannelData(i).subarray(0, numReadSamples);
				output.set(channelData, i * numReadSamples);
			}
			return numReadSamples * this.buffer.numberOfChannels * 4;
		},
		getNumberOfChannels() {
			if (!this.buffer) {
				console.log("Trying to get metadata of sound which is not loaded.");
				return 0;
			}
			return this.buffer.numberOfChannels;
		},
		getFrequency() {
			if (!this.buffer) {
				console.log("Trying to get metadata of sound which is not loaded.");
				return 0;
			}
			return this.buffer.sampleRate;
		}
	};
	return soundClip;
}
function jsAudioCreateUncompressedSoundClipFromPCM(channels, length, sampleRate, ptr) {
	if (WEBAudio.audioContext) {
		const buffer = WEBAudio.audioContext.createBuffer(channels, length, sampleRate);
		for (let i = 0; i < channels; i++) {
			const offs = (ptr >> 2) + length * i;
			const copyToChannel = buffer.copyToChannel || function(source, channelNumber, startInChannel) {
				const clipped = source.subarray(0, Math.min(source.length, buffer.length - (startInChannel | 0)));
				buffer.getChannelData(channelNumber | 0).set(clipped, startInChannel | 0);
			};
		}
		return jsAudioCreateUncompressedSoundClip(buffer, false, length);
	}
	return jsAudioCreateUncompressedSoundClip(null, false, length);
}
var AudioChannelInstance = class {
	threeD = false;
	source;
	gain;
	callback = 0;
	userData = 0;
	loop = false;
	loopStart = 0;
	loopEnd = 0;
	deleyTime = 0;
	deleyOffset = 0;
	constructor(callback, userData) {
		if (WEBAudio.audioContext) {
			this.gain = WEBAudio.audioContext.createGain();
			if (this.gain) this.gain.connect(WEBAudio.audioContext.destination);
		}
		this.callback = callback;
		this.userData = userData;
	}
	release() {
		this.disconnectSource();
		if (this.gain) this.gain.disconnect();
	}
	setLoop(loop) {
		this.loop = loop;
		if (!this.source || this.source.loop == loop) return;
		this.source.loop = loop;
	}
	setLoopPoints(loopStart, loopEnd) {
		this.loopStart = loopStart;
		this.loopEnd = loopEnd;
		if (!this.source) return;
		if (this.source.loopStart !== loopStart) this.source.loopStart = loopStart;
		if (this.source.loopEnd !== loopEnd) this.source.loopEnd = loopEnd;
	}
	playUrl(startTime, url, startOffset, volume, soundClip) {
		try {
			this.setup(url);
			if (!this.source || !this.source.mediaElement) return;
			if (typeof volume !== "undefined") this.source.mediaElement.volume = volume;
			if (WEBAudio.isMute) this.source.mediaElement.volume = 0;
			this.source.mediaElement.onPlay(() => {
				if (typeof this.source !== "undefined") {
					this.source.isPlaying = true;
					if (!this.source.loop && this.source.mediaElement) {
						const { duration } = this.source.mediaElement;
						if (duration > 0) {
							if (this.source.stopTicker) {
								clearTimeout(this.source.stopTicker);
								this.source.stopTicker = void 0;
							}
							const time = Math.floor(duration * 1e3) + 1e3;
							this.source.stopTicker = setTimeout(() => {
								if (this.source && this.source.mediaElement) this.source.mediaElement.stop();
							}, time);
						}
					}
				}
			});
			this.source.mediaElement.onPause(() => {
				if (typeof this.source !== "undefined") {
					this.source.isPlaying = false;
					if (this.source.stopTicker) {
						clearTimeout(this.source.stopTicker);
						this.source.stopTicker = void 0;
					}
				}
			});
			this.source.mediaElement.onStop(() => {
				if (typeof this.source !== "undefined") {
					if (this.source.playAfterStop) {
						this.source._reset();
						if (typeof this.source.mediaElement !== "undefined") this.source.mediaElement.play();
						return;
					}
					this.source._reset();
					this.disconnectSource();
				}
			});
			this.source.mediaElement.onEnded(() => {
				if (typeof this.source !== "undefined") {
					this.source._reset();
					this.disconnectSource();
				}
				if (this.callback) {}
			});
			this.source.mediaElement.onError((e) => {
				printErrMsg(e);
				const { errMsg } = e;
				if (errMsg && errMsg.indexOf("play audio fail") < 0) return;
				if (typeof this.source !== "undefined" && this.source.mediaElement) {
					this.source._reset();
					this.source.mediaElement.stop();
				}
			});
			const fn = () => {
				if (typeof this.source !== "undefined" && this.source.mediaElement) {
					const { duration } = this.source.mediaElement;
					setTimeout(() => {
						if (soundClip && this.source && this.source.mediaElement) soundClip.length = Math.round(Math.max(this.source.mediaElement.duration, 0) * 44100);
					}, 0);
				}
			};
			if (!this.source.canPlayFnList) this.source.canPlayFnList = [];
			this.source.canPlayFnList.push(fn);
			this.source.mediaElement.onCanplay(fn);
			this.source.mediaElement.loop = this.loop;
			this.deleyTime = startTime;
			this.deleyOffset = startOffset;
			this.source.start(startTime, startOffset);
			this.source.playbackStartTime = startTime - startOffset / this.source.playbackRateValue;
		} catch (e) {
			printErrMsg(`playUrl error. Exception: ${e}`);
		}
	}
	playBuffer(startTime, buffer, startOffset, channel) {
		try {
			this.setup();
			if (!this.source) return;
			this.source.buffer = buffer;
			this.source.onended = () => {
				this.disconnectSource();
				if (this.callback) {}
			};
			if (this.gain && channel) {
				let volume;
				if (WEBAudio.isMute) {
					godotAudioVolume.set(channel, this.gain.gain.value || 1);
					volume = 0;
				} else volume = godotAudioVolume.get(channel);
				if (this.gain.gain.value !== volume && typeof volume === "number") this.gain.gain.value = volume;
			}
			this.source.loop = this.loop;
			this.source.loopStart = this.loopStart;
			this.source.loopEnd = this.loopEnd;
			this.source.start(startTime, startOffset);
			this.source.playbackStartTime = startTime - startOffset / this.source.playbackRateValue;
		} catch (e) {
			printErrMsg(`playBuffer error. Exception: ${e}`);
		}
	}
	disconnectSource() {
		if (this.source) if (this.source.mediaElement) {
			destroyInnerAudio(this.source.instanceId, false);
			delete this.source.mediaElement;
			delete this.source;
		} else if (!this.source.isPausedMockNode) {
			this.source.onended = null;
			if (this.source.disconnect) this.source.disconnect();
			if (GameGlobal.isIOSHighPerformanceMode) this.source.buffer = null;
			WEBAudio.bufferSourceNodeLength -= 1;
			delete this.source;
		} else this.source.buffer = null;
	}
	stop(delay) {
		if (!WEBAudio.audioContext) return;
		if (this.source) {
			if (this.source.buffer) {
				try {
					this.source.stop(WEBAudio.audioContext.currentTime + delay);
				} catch (e) {}
				if (delay == 0) this.disconnectSource();
			} else if (this.source.mediaElement) this.source.stop(delay);
		}
	}
	isPaused() {
		if (!this.source) return true;
		if (this.source.isPausedMockNode) return true;
		if (this.source.mediaElement) return (!this.source.isPlaying || this.source.pauseRequested) ?? true;
		return false;
	}
	pause() {
		const { source } = this;
		if (!source) return;
		if (source.mediaElement) {
			source._pauseMediaElement?.();
			return;
		}
		if (source.isPausedMockNode) return;
		const pausedSource = {
			isPausedMockNode: true,
			loop: this.loop,
			loopStart: this.loopStart,
			loopEnd: this.loopEnd,
			buffer: source.buffer,
			playbackRate: source.playbackRateValue,
			playbackPausedAtPosition: source.estimatePlaybackPosition(),
			setPitch(v) {
				this.playbackRate = v;
			},
			_reset() {}
		};
		this.stop(0);
		this.disconnectSource();
		this.source = pausedSource;
	}
	resume() {
		if (!WEBAudio.audioContext) return;
		if (!this.source) return;
		if (this.source.mediaElement) {
			this.source.start(this.deleyTime, this.deleyOffset);
			delete this.deleyTime;
			delete this.deleyOffset;
			return;
		}
		const pausedSource = this.source;
		if (!pausedSource.isPausedMockNode) return;
		delete this.source;
		if (!pausedSource.buffer) return;
		this.playBuffer(WEBAudio.audioContext.currentTime - Math.min(0, pausedSource.playbackPausedAtPosition), pausedSource.buffer, Math.max(0, pausedSource.playbackPausedAtPosition));
		const getSource = this.source;
		if (getSource) {
			getSource.loop = pausedSource.loop;
			getSource.loopStart = pausedSource.loopStart;
			getSource.loopEnd = pausedSource.loopEnd;
			getSource.setPitch(pausedSource.playbackRate);
		}
	}
	setVolume(volume, isDefault) {
		if (!WEBAudio.audioContext) return;
		if (WEBAudio.isMute) volume = 0;
		if (isDefault && volume == 1) return;
		if (this.source) {
			if (this.source.buffer && this.gain) this.gain.gain.value = volume;
			else if (this.source.mediaElement) this.source.mediaElement.volume = volume;
		}
	}
	setup(url) {
		if (!WEBAudio.audioContext) return;
		if (this.source && !this.source.isPausedMockNode) if (!this.source.url) {
			if (typeof url !== "undefined") this.stop(0);
		} else if (typeof url === "undefined") {
			if (typeof this.source !== "undefined") this.source._reset();
			this.disconnectSource();
		} else {
			this.source._reset();
			this.disconnectSource();
		}
		if (!url) {
			this.source = WEBAudio.audioContext.createBufferSource();
			WEBAudio.bufferSourceNodeLength += 1;
			const { source } = this;
			Object.defineProperty(this.source, "playbackRateValue", {
				get() {
					return source?.playbackRate?.value ?? 0;
				},
				set(v) {
					if (!source) return;
					if (typeof source.playbackRate === "undefined") return;
					source.playbackRate.value = v;
				}
			});
		} else {
			const { audio: getAudio, id: instanceId } = createInnerAudio();
			getAudio.src = url;
			const innerFixPlay = () => {
				if (!this.source) return;
				this.source.needCanPlay = true;
				if (this.source.fixPlayTicker) {
					clearTimeout(this.source.fixPlayTicker);
					delete this.source.fixPlayTicker;
				}
				this.source.fixPlayTicker = setTimeout(() => {
					if (this.source && this.source.mediaElement && this.source.needCanPlay && !this.source.isPlaying) this.source.mediaElement.play();
				}, 100);
			};
			const innerPlay = () => {
				if (this.source && this.source.mediaElement) if (isSupportBufferURL && this.source.readyToPlay) {
					if (this.source.stopCache) {
						this.source.stopCache = false;
						this.source.playAfterStop = true;
					} else if (!this.source.isPlaying) {
						if (isAndroid) innerFixPlay();
						this.source.mediaElement.play();
					}
				} else {
					const fn = () => {
						if (!this.source) return;
						this.source.needCanPlay = false;
						this.source.readyToPlay = true;
						if (typeof this.source.mediaElement !== "undefined") {
							const { duration } = this.source.mediaElement;
							this.source.canPlayFnList.forEach((fn$1) => {
								this.source?.mediaElement?.offCanplay(fn$1);
							});
							this.source.canPlayFnList = [];
						}
						if (this.source.stopCache) {
							this.source.stopCache = false;
							this.source.playAfterStop = true;
						} else if (!this.source.isPlaying) {
							if (isAndroid) innerFixPlay();
							if (typeof this.source.mediaElement !== "undefined") this.source.mediaElement.play();
						}
					};
					if (!this.source.canPlayFnList) this.source.canPlayFnList = [];
					this.source.canPlayFnList.push(fn);
					this.source.mediaElement.onCanplay(fn);
					innerFixPlay();
				}
			};
			const _reset = () => {
				if (!this.source) return;
				this.source.readyToPlay = false;
				this.source.isPlaying = false;
				this.source.stopCache = false;
				this.source.playAfterStop = false;
				this.source.needCanPlay = false;
				if (this.source.stopTicker) {
					clearTimeout(this.source.stopTicker);
					this.source.stopTicker = void 0;
				}
			};
			const _pauseMediaElement = () => {
				if (typeof this.source === "undefined") return;
				if (this.source.playTimeout) this.source.pauseRequested = true;
				else if (this.source.isPlaying && this.source.mediaElement) this.source.mediaElement.pause();
			};
			const _startPlayback = (offset) => {
				if (typeof this.source === "undefined" || !this.source.mediaElement) return;
				if (this.source.playTimeout) {
					if (typeof this.source.mediaElement.seek === "function") this.source.mediaElement.seek(offset);
					else this.source.mediaElement.currentTime = offset;
					this.source.pauseRequested = false;
					return;
				}
				innerPlay();
				if (typeof this.source.mediaElement.seek === "function") this.source.mediaElement.seek(offset);
				else this.source.mediaElement.currentTime = offset;
			};
			const start = (startTime, offset) => {
				if (typeof this.source === "undefined") return;
				if (typeof startTime === "undefined" && typeof offset === "undefined") {
					innerPlay();
					return;
				}
				if (typeof startTime === "undefined") startTime = 0;
				if (typeof offset === "undefined") offset = 0;
				const startDelayThresholdMS = 4;
				const startDelayMS = startTime * 1e3;
				if (startDelayMS > startDelayThresholdMS) {
					if (this.source.playTimeout) clearTimeout(this.source.playTimeout);
					this.source.playTimeout = setTimeout(() => {
						if (typeof this.source !== "undefined") {
							delete this.source.playTimeout;
							this.source._startPlayback?.(offset || 0);
						}
					}, startDelayMS);
				} else this.source._startPlayback?.(offset);
			};
			const stop = (stopTime) => {
				if (typeof this.source === "undefined") return;
				if (typeof stopTime === "undefined") stopTime = 0;
				const stopDelayThresholdMS = 4;
				const stopDelayMS = stopTime * 1e3;
				if (stopDelayMS > stopDelayThresholdMS) setTimeout(() => {
					if (this.source && this.source.mediaElement) {
						this.source.stopCache = true;
						this.source.mediaElement.stop();
					}
				}, stopDelayMS);
				else if (this.source.mediaElement) {
					this.source.stopCache = true;
					this.source.mediaElement.stop();
				}
			};
			this.source = {
				instanceId,
				mediaElement: getAudio,
				url,
				playbackStartTime: 0,
				playbackRate: 1,
				pauseRequested: false,
				_reset,
				_pauseMediaElement,
				_startPlayback,
				start,
				stop
			};
			const { buffered, referrerPolicy, volume } = getAudio;
			const { source } = this;
			Object.defineProperty(this.source, "loopStart", {
				get() {
					return 0;
				},
				set(v) {}
			});
			Object.defineProperty(source, "loopEnd", {
				get() {
					return 0;
				},
				set(v) {}
			});
			Object.defineProperty(source, "loop", {
				get() {
					return source?.mediaElement?.loop ?? false;
				},
				set(v) {
					if (!source || !source.mediaElement) return;
					source.mediaElement.loop = v;
				}
			});
			Object.defineProperty(source, "playbackRateValue", {
				get() {
					return source?.playbackRate ?? 1;
				},
				set(v) {
					if (!source || !source.mediaElement) return;
					if (!isSupportPlayBackRate) source.mediaElement.playbackRate = 1;
					else {
						source.playbackRate = v;
						source.mediaElement.playbackRate = v;
					}
				}
			});
			Object.defineProperty(source, "currentTime", {
				get() {
					return source?.mediaElement?.currentTime ?? 0;
				},
				set(v) {
					if (!source || !source.mediaElement) return;
					if (typeof source.mediaElement.seek === "function") source.mediaElement.seek(v);
					else source.mediaElement.currentTime = v;
				}
			});
		}
		if (!this.source) return;
		this.source.estimatePlaybackPosition = () => {
			if (!this.source) return 0;
			let t;
			if (WEBAudio.audioContext) t = (WEBAudio.audioContext.currentTime - this.source.playbackStartTime) * this.source.playbackRateValue;
			else t = -this.source.playbackStartTime * this.source.playbackRateValue;
			if (typeof this.source.loopStart !== "undefined" && typeof this.source.loopEnd !== "undefined") {
				if (this.source.loop && t >= this.source.loopStart) t = (t - this.source.loopStart) % (this.source.loopEnd - this.source.loopStart) + this.source.loopStart;
			}
			return t;
		};
		this.source.setPitch = (newPitch) => {
			if (!this.source) return 0;
			const curPosition = this.source.estimatePlaybackPosition();
			if (curPosition >= 0) {
				if (WEBAudio.audioContext) this.source.playbackStartTime = WEBAudio.audioContext.currentTime - curPosition / newPitch;
			}
			this.source.playbackRateValue = newPitch;
		};
		this.setupPanning();
	}
	setupPanning() {
		if (typeof this.source === "undefined") return;
		if (this.source.isPausedMockNode) return;
		if (this.source.disconnect && this.source.connect) {
			this.source.disconnect();
			if (this.gain) this.source.connect(this.gain);
		}
	}
	isStopped() {
		return !this.source;
	}
};
var godot_audio_default = {
	WEBAudio,
	create_channel(callback, userData) {
		if (!WEBAudio.audioContext || WEBAudio.audioWebEnabled === 0) return 0;
		const channel = new AudioChannelInstance(callback, userData);
		WEBAudio.audioInstances[++WEBAudio.audioInstanceIdCounter] = channel;
		return WEBAudio.audioInstanceIdCounter;
	},
	get_length(bufferInstance) {
		if (WEBAudio.audioWebEnabled === 0) return defaultSoundLength;
		const soundClip = WEBAudio.audioInstances[bufferInstance];
		if (!soundClip) return defaultSoundLength;
		const length = soundClip.getLength() || defaultSoundLength;
		return length;
	},
	get_load_state(bufferInstance) {
		if (WEBAudio.audioWebEnabled === 0) return 2;
		const soundClip = WEBAudio.audioInstances[bufferInstance];
		if (!soundClip || soundClip.error) return 2;
		if (soundClip.buffer) return 0;
		if (soundClip.url && soundClip.length) return 0;
		return 1;
	},
	init() {
		try {
			if (wx && wx.createWebAudioContext) WEBAudio.audioContext = wx.createWebAudioContext();
			if (!WEBAudio.audioContext) {
				printErrMsg("Minigame Web Audio API not suppoted");
				return;
			}
			WEBAudio.audioWebSupport = 1;
			WEBAudio.audioWebEnabled = 1;
			let webAutoResumeTicker = null;
			wx.onHide(() => {
				if (webAutoResumeTicker) {
					clearTimeout(webAutoResumeTicker);
					webAutoResumeTicker = null;
				}
				if (!GameGlobal.isIOSHighPerformanceMode) WEBAudio.audioContext?.suspend();
			});
			wx.onShow(() => {
				WEBAudio.audioContext?.resume();
			});
			if (webAudioNeedResume) webAutoResumeTicker = setTimeout(() => {
				resumeWebAudio();
			}, 2e3);
		} catch (e) {
			printErrMsg("Web Audio API is not supported in this browser");
		}
	},
	is_stopped(channelInstance) {
		if (WEBAudio.audioWebEnabled == 0) return true;
		const channel = WEBAudio.audioInstances[channelInstance];
		if (!channel) return true;
		return channel.isStopped();
	},
	load_buffer(audioData) {
		let length = audioData.length;
		const soundClip = jsAudioCreateUncompressedSoundClip(null, false, length);
		WEBAudio.audioContext?.decodeAudioData(audioData, (buffer) => {
			soundClip.buffer = buffer;
			WEBAudio.audioBufferLength += length;
		}, (error) => {
			soundClip.error = true;
			console.log(`Decode error: ${error}`);
		});
		WEBAudio.audioInstances[++WEBAudio.audioInstanceIdCounter] = soundClip;
		return WEBAudio.audioInstanceIdCounter;
	},
	load_PCM(channels, length, sampleRate, ptr) {
		if (!WEBAudio.audioContext || WEBAudio.audioWebSupport === 0 || WEBAudio.audioWebEnabled === 0) return 0;
		const sound = jsAudioCreateUncompressedSoundClipFromPCM(channels, length, sampleRate, ptr);
		WEBAudio.audioInstances[++WEBAudio.audioInstanceIdCounter] = sound;
		return WEBAudio.audioInstanceIdCounter;
	},
	play(bufferInstance, channelInstance, offset, delay) {
		if (!WEBAudio.audioContext || WEBAudio.audioWebEnabled === 0) return;
		GODOTSDK.audio.stop(channelInstance, 0);
		const soundClip = WEBAudio.audioInstances[bufferInstance];
		const channel = WEBAudio.audioInstances[channelInstance];
		if (soundClip && soundClip.url) try {
			channel.playUrl(delay, soundClip.url, offset, godotAudioVolume.get(channel), soundClip);
		} catch (e) {
			printErrMsg(`playUrl error. Exception: ${e}`);
		}
		else if (soundClip && soundClip.buffer) try {
			channel.playBuffer(WEBAudio.audioContext.currentTime + delay, soundClip.buffer, offset, channel);
		} catch (e) {
			printErrMsg(`playBuffer error. Exception: ${e}`);
		}
		else console.log("Trying to play sound which is not loaded.");
	},
	release_instance(instance) {
		if (WEBAudio.audioWebEnabled === 0) return;
		const object = WEBAudio.audioInstances[instance];
		if (object) object.release();
		delete WEBAudio.audioInstances[instance];
	},
	resume_if_needed() {
		if (WEBAudio.audioWebSupport === 0 || WEBAudio.audioWebEnabled === 0) return;
		resumeWebAudio();
	},
	set_3d(channelInstance, threeD) {
		if (WEBAudio.audio3DSupport === 0 || WEBAudio.audioWebEnabled === 0) return;
		const channel = WEBAudio.audioInstances[channelInstance];
		if (channel.threeD != threeD) {
			channel.threeD = threeD;
			if (!channel.source) channel.setup();
			channel.setupPanning();
		}
	},
	set_listener_orientation(x, y, z, xUp, yUp, zUp) {
		if (!WEBAudio.audioContext || WEBAudio.audio3DSupport === 0 || WEBAudio.audioWebSupport === 0 || WEBAudio.audioWebEnabled === 0) return;
		x = x > 0 ? 0 : x;
		y = y > 0 ? 0 : y;
		z = z > 0 ? 0 : z;
		xUp = xUp < 0 ? 0 : xUp;
		yUp = yUp < 0 ? 0 : yUp;
		zUp = zUp < 0 ? 0 : zUp;
		if (x == WEBAudio.lOrientation.x && y == WEBAudio.lOrientation.y && z == WEBAudio.lOrientation.z && xUp == WEBAudio.lOrientation.xUp && yUp == WEBAudio.lOrientation.yUp && zUp == WEBAudio.lOrientation.zUp) return;
		WEBAudio.lOrientation.x = x;
		WEBAudio.lOrientation.y = y;
		WEBAudio.lOrientation.z = z;
		WEBAudio.lOrientation.xUp = xUp;
		WEBAudio.lOrientation.yUp = yUp;
		WEBAudio.lOrientation.zUp = zUp;
		if (WEBAudio.audioContext.listener.forwardX) {
			WEBAudio.audioContext.listener.forwardX.setValueAtTime(-x, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.forwardY.setValueAtTime(-y, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.forwardZ.setValueAtTime(-z, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.upX.setValueAtTime(xUp, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.upY.setValueAtTime(yUp, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.upZ.setValueAtTime(zUp, WEBAudio.audioContext.currentTime);
		} else WEBAudio.audioContext.listener.setOrientation(-x, -y, -z, xUp, yUp, zUp);
	},
	set_listener_position(x, y, z) {
		if (!WEBAudio.audioContext || WEBAudio.audio3DSupport === 0 || WEBAudio.audioWebSupport === 0 || WEBAudio.audioWebEnabled === 0) return;
		x = x < 0 ? 0 : x;
		y = y < 0 ? 0 : y;
		z = z < 0 ? 0 : z;
		if (x == WEBAudio.lPosition.x && y == WEBAudio.lPosition.y && z == WEBAudio.lPosition.z) return;
		WEBAudio.lPosition.x = x;
		WEBAudio.lPosition.y = y;
		WEBAudio.lPosition.z = z;
		if (WEBAudio.audioContext.listener.positionX) {
			WEBAudio.audioContext.listener.positionX.setValueAtTime(x, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.positionY.setValueAtTime(y, WEBAudio.audioContext.currentTime);
			WEBAudio.audioContext.listener.positionZ.setValueAtTime(z, WEBAudio.audioContext.currentTime);
		} else WEBAudio.audioContext.listener.setPosition(x, y, z);
	},
	set_loop(channelInstance, loop) {
		if (WEBAudio.audioWebEnabled === 0) return;
		const channel = WEBAudio.audioInstances[channelInstance];
		if (!channel.source) channel.setup();
		if (!channel.source) return;
		channel.setLoop(loop > 0);
	},
	set_loop_points(channelInstance, loopStart, loopEnd) {
		if (WEBAudio.audioWebEnabled === 0) return;
		const channel = WEBAudio.audioInstances[channelInstance];
		if (!channel.source) channel.setup();
		if (!channel.source) return;
		channel.setLoopPoints(loopStart, loopEnd);
	},
	set_paused(channelInstance, paused) {
		if (WEBAudio.audioWebEnabled === 0) return;
		const channel = WEBAudio.audioInstances[channelInstance];
		if (!!paused !== channel.isPaused()) if (paused) channel.pause();
		else channel.resume();
	},
	set_pitch(channelInstance, v) {
		if (WEBAudio.audioWebSupport === 0 || WEBAudio.audioWebEnabled === 0) return;
		try {
			WEBAudio.audioInstances[channelInstance].source?.setPitch(v);
		} catch (e) {
			printErrMsg(`Invalid audio pitch ${v} specified to WebAudio backend!`);
		}
	},
	set_position(channelInstance, x, y, z) {
		if (WEBAudio.audio3DSupport === 0 || WEBAudio.audioWebSupport === 0 || WEBAudio.audioWebEnabled === 0) return;
		console.error("不支持3d音效");
	},
	set_volume(channelInstance, v) {
		if (WEBAudio.audioWebEnabled === 0) return;
		try {
			const volume = Number(v.toFixed(2));
			const channel = WEBAudio.audioInstances[channelInstance];
			const cur = godotAudioVolume.get(channel);
			if (cur === volume) return;
			godotAudioVolume.set(channel, volume);
			channel.setVolume(volume, cur == void 0);
		} catch (e) {
			printErrMsg(`Invalid audio volume ${v} specified to WebAudio backend!`);
		}
	},
	stop(channelInstance, delay) {
		if (WEBAudio.audioWebEnabled === 0) return;
		const channel = WEBAudio.audioInstances[channelInstance];
		channel.stop(delay);
	},
	get_data(bufferInstance, ptr, length) {
		if (WEBAudio.audioWebEnabled === 0) return 0;
		const soundClip = WEBAudio.audioInstances[bufferInstance];
		if (!soundClip) return 0;
		return soundClip.getData(ptr, length) ?? 0;
	},
	get_metadata(buffer, bufferInstance, metaData) {
		if (WEBAudio.audioWebEnabled === 0) {
			buffer[metaData >> 2] = 0;
			buffer[(metaData >> 2) + 1] = 0;
			return false;
		}
		const soundClip = WEBAudio.audioInstances[bufferInstance];
		if (!soundClip) {
			buffer[metaData >> 2] = 0;
			buffer[(metaData >> 2) + 1] = 0;
			return false;
		}
		buffer[metaData >> 2] = soundClip.getNumberOfChannels() ?? 0;
		buffer[(metaData >> 2) + 1] = soundClip.getFrequency() ?? 0;
		return true;
	},
	get_audio_buffer_sample_rate(soundInstance) {
		if (WEBAudio.audioWebEnabled === 0) return WEBAudio.FAKEMOD_SAMPLERATE;
		const audioInstance = WEBAudio.audioInstances[soundInstance];
		if (!audioInstance) return WEBAudio.FAKEMOD_SAMPLERATE;
		const buffer = audioInstance.buffer ? audioInstance.buffer : audioInstance.source ? audioInstance.source?.buffer : null;
		if (!buffer) return WEBAudio.FAKEMOD_SAMPLERATE;
		return buffer.sampleRate;
	},
	get_audio_context_sample_rate() {
		if (WEBAudio.audioWebEnabled === 0 || !WEBAudio.audioContext) return WEBAudio.FAKEMOD_SAMPLERATE;
		return WEBAudio.audioContext.sampleRate;
	}
};

//#endregion
//#region audio/common.js
mkCacheDir();
var common_default = {
	audioStore() {
		return WEBAudio;
	},
	WXGetAudioCount() {
		return {
			innerAudio: Object.keys(audios).length,
			webAudio: WEBAudio.bufferSourceNodeLength,
			buffer: WEBAudio.audioBufferLength
		};
	},
	WXSetAudioMute(value) {
		if (typeof value !== "boolean") return;
		if (WEBAudio.isMute === value) return;
		WEBAudio.isMute = value;
		for (const channelInstance of Object.keys(WEBAudio.audioInstances)) {
			const channel = WEBAudio.audioInstances[+channelInstance];
			if (channel.source) channel.setVolume?.(value ? 0 : godotAudioVolume.get(channel) ?? 1);
		}
		for (const innerAudio of Object.values(audios)) innerAudio.volume = value ? 0 : innerAudioVolume.get(innerAudio) ?? 1;
	}
};
const HandleInterruption = { init() {
	let INTERRUPT_LIST = {};
	wx.onHide(() => {
		Object.keys(audios).forEach((key) => {
			if (!audios[key].paused !== false) INTERRUPT_LIST[key] = true;
		});
	});
	wx.onShow(() => {
		Object.keys(audios).forEach((key) => {
			if (audios[key].paused !== false && INTERRUPT_LIST[key]) audios[key].play();
		});
		INTERRUPT_LIST = {};
	});
	wx.onAudioInterruptionBegin(() => {
		Object.keys(audios).forEach((key) => {
			if (!audios[key].paused !== false) INTERRUPT_LIST[key] = true;
		});
	});
	wx.onAudioInterruptionEnd(() => {
		Object.keys(audios).forEach((key) => {
			if (audios[key].paused !== false && INTERRUPT_LIST[key]) audios[key].play();
		});
		INTERRUPT_LIST = {};
		resumeWebAudio();
	});
} };
HandleInterruption.init();

//#endregion
//#region audio/index.js
var audio_default = {
	...inner_audio_default,
	...godot_audio_default,
	...common_default
};

//#endregion
export { audio_default, utils_default };