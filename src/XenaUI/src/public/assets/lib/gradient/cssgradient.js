var refEn = 0,
  tagsInitDone = 0,
  gptAdSlots = [],
  adDomain = 'cssgradient.io',
  breakpoints = { desktop: '1024', tablet: '768', mobile: '0' },
  domainValid = 1,
  PREBID_TIMEOUT = 1500,
  interstitialDone = 0,
  waldoTimeOuts = [],
  waldoAdRefreshes = [],
  allAdUnits = [],
  blockAdsOn = [],
  pubwiseSiteId = '',
  adTagsInitFlag = 0,
  siteId = 4645,
  bidDivAvailable = 0,
  waldoTagsStatus = [],
  googletag = googletag || {},
  pbjs = pbjs || {},
  switchUserSync = 0,
  waldoRestrictIp = 0,
  waldoImpressionDone = 0,
  blockedPageAds = '',
  waldoGDPR = 1,
  waldoCountry = waldoReadCookie('waldo_country'),
  waldoContinent = waldoReadCookie('waldo_continent'),
  waldoDataPointsDone = waldoReadCookie('waldo_data_points_done');
function adDomainCheck() {
  if (blockAdsOn.length) {
    var e = window.location.pathname;
    for (i = 0; i < blockAdsOn.length; i++) if (blockAdsOn[i] == e) return !1;
  }
  var a = window.location.href;
  (a = decodeURI(a)), (a = decodeURIComponent(a));
  var t =
    /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.exec(
      a
    );
  return (
    null === t ||
    -1 !== t[0].indexOf('volkmarkt.com') ||
    (waldoEmailDetected(a), !1)
  );
}
function waldoInitScripts() {
  var e = document.createElement('style');
  e.type = 'text/css';
  var a = '';
  (a +=
    '.waldo-sticky-footer{position: fixed; width: 100%; bottom: 0px; left: 0px; text-align: center; z-index: 9000;}'),
    (a +=
      '.waldo-sticky-footer iframe, .waldo-sticky-footer div {margin-left: auto;margin-right: auto;}'),
    (a += '.waldo-sticky-sidebar{position: fixed; top: 10px;z-index: 90}'),
    (a += '.waldo-sticky-css{position: sticky; top: 10px; z-index: 90}'),
    (a +=
      '.waldo-overlay{position: fixed;height: 100%;width: 100%;top: 0;left: 0;z-index: 105;background: rgba(0,0,0,0.7);}'),
    (a +=
      '#waldo-counter {position: absolute;bottom: 0;right: 0;color: #fff;font-size: 30px;padding: 15px;}'),
    browserWidth >= breakpoints.desktop &&
      ((a +=
        '.waldo-bfleft {position: fixed; left: 0; top: 10px;z-index:101;}'),
      (a +=
        '.waldo-bfright {position: fixed; right: 0; top: 10px;z-index:101;}')),
    (a += '#waldo-tag-6038 {clear: both !important;}'),
    (a +=
      'div[class^="app_gdpr-"] a {color: #41afbb !important; text-decoration: underline !important}'),
    (a += '#waldo-close-button a {'),
    (a += 'border: 1px solid rgba(0,0,0,.35);'),
    (a += 'padding: 3px;'),
    (a += 'font-size: 12px;'),
    (a += 'color: #fff;'),
    (a += 'font-weight: bold;'),
    (a += 'background-color: #777;'),
    (a += '}'),
    e.appendChild(document.createTextNode(a)),
    document.getElementsByTagName('head')[0].appendChild(e);
  var t = document.createElement('script');
  (t.async = !0), (t.type = 'text/javascript');
  var d = 'https:' == document.location.protocol;
  t.src =
    (d ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
  var i = document.getElementsByTagName('script')[0];
  i.parentNode.insertBefore(t, i);
  var s = document.createElement('script');
  (s.type = 'text/javascript'),
    (s.text = 'googletag.cmd.push(function() {'),
    (s.text +=
      "gptAdSlots[4646] = googletag.defineSlot('/124067137/cssgradient300x250FL_1', [[300, 250], [300, 600]], 'waldo-tag-4646').defineSizeMapping(googletag.sizeMapping().addSize([1024, 0], [[300, 250], [300, 600]]).addSize([768, 0], [[300, 250], [300, 600]]).addSize([0, 0], [[300, 250], [300, 600]]).build()).addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4647] = googletag.defineSlot('/8491498/cssgradient300x250FL_1_Universal_Passback_5cfe60592d002', [300, 250], 'waldo-tag-4647').addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4648] = googletag.defineSlot('/124067137/cssgradient300x250FL_2', [[300, 250], [300, 600]], 'waldo-tag-4648').defineSizeMapping(googletag.sizeMapping().addSize([1024, 0], [[300, 250], [300, 600]]).addSize([768, 0], [[300, 250], [300, 600]]).addSize([0, 0], [[300, 250], [300, 600]]).build()).addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4649] = googletag.defineSlot('/8491498/cssgradient300x250FL_2_Universal_Passback_5cfe605d0bb66', [300, 250], 'waldo-tag-4649').addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4650] = googletag.defineSlot('/124067137/cssgradient728x90FL_1', [[728, 90], [970, 90], [320, 50]], 'waldo-tag-4650').defineSizeMapping(googletag.sizeMapping().addSize([1024, 0], [[728, 90], [970, 90]]).addSize([768, 0], [[320, 50]]).addSize([0, 0], [[320, 50]]).build()).addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4651] = googletag.defineSlot('/8491498/cssgradient728x90FL_1_Universal_Passback_5cfe60613634e', [[728, 90], [320, 50]], 'waldo-tag-4651').defineSizeMapping(googletag.sizeMapping().addSize([1024, 0], [[728, 90]]).addSize([768, 0], [[320, 50]]).addSize([0, 0], [[320, 50]]).build()).addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4652] = googletag.defineSlot('/124067137/cssgradient728x90FS_1', [[728, 90], [320, 50]], 'waldo-tag-4652').defineSizeMapping(googletag.sizeMapping().addSize([1024, 0], [[728, 90]]).addSize([768, 0], [[320, 50]]).addSize([0, 0], [[320, 50]]).build()).addService(googletag.pubads());"),
    (s.text +=
      "gptAdSlots[4653] = googletag.defineSlot('/8491498/cssgradient728x90FS_1_Universal_Passback_5cfe6066dcb05', [[728, 90], [320, 50]], 'waldo-tag-4653').defineSizeMapping(googletag.sizeMapping().addSize([1024, 0], [[728, 90]]).addSize([768, 0], [[320, 50]]).addSize([0, 0], [[320, 50]]).build()).addService(googletag.pubads());"),
    (s.text += 'googletag.pubads().enableSingleRequest();'),
    (s.text += 'googletag.enableServices();'),
    (s.text +=
      "googletag.pubads().addEventListener('impressionViewable', function(event) {hb_refresh(event); hb_sroll_pause(event);});"),
    (s.text +=
      "googletag.pubads().addEventListener('slotRenderEnded', function(event) {waldoAddCloseBtn(event); waldoPassbackInit(event);waldoInterstitialInit(event);})"),
    (s.text += '});'),
    document.getElementsByTagName('head')[0].appendChild(s);
  var r = document.createElement('script');
  (r.type = 'text/javascript'),
    (r.async = !0),
    (r.src =
      'https://cdn.thisiswaldo.com/sites/all/modules/custom/ad_delivery/prebid.js');
  var o = document.getElementsByTagName('head')[0];
  o.insertBefore(r, o.firstChild);
}
Array.prototype.find ||
  Object.defineProperty(Array.prototype, 'find', {
    value: function (e) {
      if (null == this) throw new TypeError('"this" is null or not defined');
      var a = Object(this),
        t = a.length >>> 0;
      if ('function' != typeof e)
        throw new TypeError('predicate must be a function');
      for (var d = arguments[1], i = 0; i < t; ) {
        var s = a[i];
        if (e.call(d, s, i, a)) return s;
        i++;
      }
    },
    configurable: !0,
    writable: !0,
  }),
  null === waldoCountry && (PREBID_TIMEOUT += 500);
var affiliateBanners,
  browserWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  ),
  adUnits = [
    {
      code: 'waldo-tag-4646',
      mediaTypes: { banner: { sizes: [] } },
      customParams: {
        slotNo: '4646',
        amp_code: '/124067137/cssgradient300x250FL_1',
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback: '4647',
        passback_refresh: '0',
        mobile_refresh: 1,
      },
      sizeMapping: [
        {
          minWidth: '1024',
          sizes: [
            [300, 250],
            [300, 600],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200348' },
            },
            { bidder: 'gumgum', params: { inSlot: '7722' } },
            { bidder: 'gumgum', params: { inSlot: '7724' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'dVQ06ADzGr6yooaKlId8sQ',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989152199817062' },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153776875366' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611931' } },
            { bidder: 'sovrn', params: { tagid: '611932' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 250] },
            },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 600] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'bIDA' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: '1iqK' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'kTbSC4suDuQW1CWPnxq9HMZz' },
            },
            {
              bidder: 'sharethrough',
              params: { pkey: 'Fz7FdWrdW7mbDLJqhtmCh59N' },
            },
          ],
        },
        {
          minWidth: '768',
          sizes: [
            [300, 250],
            [300, 600],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200348' },
            },
            { bidder: 'gumgum', params: { inSlot: '7722' } },
            { bidder: 'gumgum', params: { inSlot: '7724' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'c2uq4MGH8r6y0WaKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989152199817062' },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153776875366' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611931' } },
            { bidder: 'sovrn', params: { tagid: '611932' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 250] },
            },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 600] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'bIDA' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: '1iqK' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'kTbSC4suDuQW1CWPnxq9HMZz' },
            },
            {
              bidder: 'sharethrough',
              params: { pkey: 'Fz7FdWrdW7mbDLJqhtmCh59N' },
            },
          ],
        },
        {
          minWidth: '0',
          sizes: [
            [300, 250],
            [300, 600],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200348' },
            },
            { bidder: 'gumgum', params: { inSlot: '7722' } },
            { bidder: 'gumgum', params: { inSlot: '7724' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'c2uq4MGH8r6y0WaKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989152199817062' },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153776875366' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611931' } },
            { bidder: 'sovrn', params: { tagid: '611932' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 250] },
            },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 600] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'bIDA' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: '1iqK' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'kTbSC4suDuQW1CWPnxq9HMZz' },
            },
            {
              bidder: 'sharethrough',
              params: { pkey: 'Fz7FdWrdW7mbDLJqhtmCh59N' },
            },
          ],
        },
      ],
      affiliate_banners: [],
    },
    {
      code: 'waldo-tag-4648',
      mediaTypes: { banner: { sizes: [] } },
      customParams: {
        slotNo: '4648',
        amp_code: '/124067137/cssgradient300x250FL_2',
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback: '4649',
        passback_refresh: '0',
        mobile_refresh: 1,
      },
      sizeMapping: [
        {
          minWidth: '1024',
          sizes: [
            [300, 250],
            [300, 600],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200354' },
            },
            { bidder: 'gumgum', params: { inSlot: '7722' } },
            { bidder: 'gumgum', params: { inSlot: '7724' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'dVQ06ADzGr6yooaKlId8sQ',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989152199817062' },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153776875366' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611931' } },
            { bidder: 'sovrn', params: { tagid: '611932' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 250] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'boDr' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'WjKR' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'Fz7FdWrdW7mbDLJqhtmCh59N' },
            },
            {
              bidder: 'sharethrough',
              params: { pkey: 'kTbSC4suDuQW1CWPnxq9HMZz' },
            },
          ],
        },
        {
          minWidth: '768',
          sizes: [
            [300, 250],
            [300, 600],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200354' },
            },
            { bidder: 'gumgum', params: { inSlot: '7722' } },
            { bidder: 'gumgum', params: { inSlot: '7724' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'c2uq4MGH8r6y0WaKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989152199817062' },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153776875366' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611931' } },
            { bidder: 'sovrn', params: { tagid: '611932' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 250] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'boDr' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'WjKR' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'Fz7FdWrdW7mbDLJqhtmCh59N' },
            },
            {
              bidder: 'sharethrough',
              params: { pkey: 'kTbSC4suDuQW1CWPnxq9HMZz' },
            },
          ],
        },
        {
          minWidth: '0',
          sizes: [
            [300, 250],
            [300, 600],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200354' },
            },
            { bidder: 'gumgum', params: { inSlot: '7722' } },
            { bidder: 'gumgum', params: { inSlot: '7724' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'c2uq4MGH8r6y0WaKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989152199817062' },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153776875366' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611931' } },
            { bidder: 'sovrn', params: { tagid: '611932' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [300, 250] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'boDr' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'WjKR' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'Fz7FdWrdW7mbDLJqhtmCh59N' },
            },
            {
              bidder: 'sharethrough',
              params: { pkey: 'kTbSC4suDuQW1CWPnxq9HMZz' },
            },
          ],
        },
      ],
      affiliate_banners: [],
    },
    {
      code: 'waldo-tag-4650',
      mediaTypes: { banner: { sizes: [] } },
      customParams: {
        slotNo: '4650',
        amp_code: '/124067137/cssgradient728x90FL_1',
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback: '4651',
        passback_refresh: '0',
        mobile_refresh: 1,
      },
      sizeMapping: [
        {
          minWidth: '1024',
          sizes: [
            [728, 90],
            [970, 90],
          ],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200358' },
            },
            { bidder: 'gumgum', params: { inSlot: '7726' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'dVQ06ADzGr6yooaKlId8sQ',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989154447964006' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611934' } },
            { bidder: 'sovrn', params: { tagid: '611935' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [728, 90] },
            },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [970, 90] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: '4og7' },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'U1O7' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'DDst6TPmS97ZYEiy3jYGsVDn' },
            },
          ],
        },
        {
          minWidth: '768',
          sizes: [[320, 50]],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200358' },
            },
            { bidder: 'gumgum', params: { inSlot: '7725' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'c2uq4MGH8r6y0WaKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153139341158' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611937' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [320, 50] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'ySbw' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
          ],
        },
        {
          minWidth: '0',
          sizes: [[320, 50]],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200358' },
            },
            { bidder: 'gumgum', params: { inSlot: '7725' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'c2uq4MGH8r6y0WaKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153139341158' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611937' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [320, 50] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'ySbw' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
          ],
        },
      ],
      affiliate_banners: [],
    },
    {
      code: 'waldo-tag-4652',
      mediaTypes: { banner: { sizes: [] } },
      customParams: {
        slotNo: '4652',
        amp_code: '/124067137/cssgradient728x90FS_1',
        sticky_footer: 1,
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback: '4653',
        passback_refresh: '0',
        mobile_refresh: 1,
      },
      sizeMapping: [
        {
          minWidth: '1024',
          sizes: [[728, 90]],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200370' },
            },
            { bidder: 'gumgum', params: { inSlot: '7726' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'dyBdcQDzGr6ykfaKkv7mNO',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989154447964006' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611934' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [728, 90] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'Ytmo' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
            {
              bidder: 'sharethrough',
              params: { pkey: 'DDst6TPmS97ZYEiy3jYGsVDn' },
            },
          ],
        },
        {
          minWidth: '768',
          sizes: [[320, 50]],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200370' },
            },
            { bidder: 'gumgum', params: { inSlot: '7725' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'cLRjT2GH8r6yo8aKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153139341158' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611937' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [320, 50] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'JFuN' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
          ],
        },
        {
          minWidth: '0',
          sizes: [[320, 50]],
          bids: [
            {
              bidder: 'appnexus',
              params: { placementId: '16200370' },
            },
            { bidder: 'gumgum', params: { inSlot: '7725' } },
            {
              bidder: '33across',
              params: {
                productId: 'siab',
                siteId: 'cLRjT2GH8r6yo8aKkGJozW',
              },
            },
            {
              bidder: 'lockerdome',
              params: { adUnitId: 'LD11989153139341158' },
            },
            {
              bidder: 'rubicon',
              params: {
                accountId: '17822',
                zoneId: '1324114',
                siteId: '267358',
              },
            },
            { bidder: 'sovrn', params: { tagid: '611937' } },
            {
              bidder: 'ix',
              params: { siteId: '382734', size: [320, 50] },
            },
            {
              bidder: 'aardvark',
              params: { ai: '4ihZ', sc: 'JFuN' },
            },
            { bidder: 'emx_digital', params: { tagid: '76665' } },
          ],
        },
      ],
      affiliate_banners: [],
    },
  ],
  passbackAdUnits = [
    {
      code: 'waldo-tag-4647',
      customParams: {
        slotNo: '4647',
        amp_code: '/124067137/cssgradient300x250FL_1',
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback_refresh: '0',
        mobile_refresh: 1,
      },
    },
    {
      code: 'waldo-tag-4649',
      customParams: {
        slotNo: '4649',
        amp_code: '/124067137/cssgradient300x250FL_2',
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback_refresh: '0',
        mobile_refresh: 1,
      },
    },
    {
      code: 'waldo-tag-4651',
      customParams: {
        slotNo: '4651',
        amp_code: '/124067137/cssgradient728x90FL_1',
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback_refresh: '0',
        mobile_refresh: 1,
      },
    },
    {
      code: 'waldo-tag-4653',
      customParams: {
        slotNo: '4653',
        amp_code: '/124067137/cssgradient728x90FS_1',
        sticky_footer: 1,
        mobile_pause: '0',
        refresh: {
          type: 'min_max',
          desktop: { min: '45', max: '90' },
          mobile: { min: '45', max: '70' },
          min: '45',
          max: '90',
          limit: '0',
        },
        passback_refresh: '0',
        mobile_refresh: 1,
      },
    },
  ];
if (
  ((allAdUnits = adUnits.concat(passbackAdUnits)),
  adUnits.forEach(function (e) {
    if (!e.bids) {
      var a = e.sizeMapping.find(function (e) {
          return browserWidth > 0
            ? browserWidth >= e.minWidth
            : 0 == e.minWidth;
        }).bids,
        t = e.sizeMapping.find(function (e) {
          return browserWidth > 0
            ? browserWidth >= e.minWidth
            : 0 == e.minWidth;
        }).sizes;
      (e.mediaTypes.banner.sizes = t), (e.bids = a), delete e.sizeMapping;
    }
  }),
  (googletag.cmd = googletag.cmd || []),
  googletag.cmd.push(function () {
    googletag.pubads().disableInitialLoad();
  }),
  adDomainCheck())
) {
  function fetchHeaderBids() {
    var e = ['prebid'],
      a = { adserverRequestSent: !1 };
    function t(t) {
      !0 !== a.adserverRequestSent &&
        ('a9' === t ? (a.a9 = !0) : 'prebid' === t && (a.prebid = !0),
        e
          .map(function (e) {
            return a[e];
          })
          .filter(Boolean).length === e.length && d());
    }
    function d() {
      !0 !== a.adserverRequestSent &&
        ((a.adserverRequestSent = !0),
        (pbjs.adserverRequestSent = !0),
        (a.sendAdserverRequest = !0),
        googletag.cmd.push(function () {
          pbjs.setTargetingForGPTAsync(), googletag.pubads().refresh();
        }));
    }
    e.forEach(function (e) {
      a[e] = !1;
    }),
      pbjs.que.push(function () {
        ('EU' != waldoReadCookie('waldo_continent') &&
          'RO' != waldoReadCookie('waldo_country')) ||
          pbjs.setConfig({
            consentManagement: {
              cmpApi: 'iab',
              timeout: 2e3,
              allowAuctionWithoutConsent: !0,
            },
          }),
          pbjs.setConfig({
            usersync: {
              userIds: [
                {
                  name: 'unifiedId',
                  params: { partner: '9zrfwmk' },
                  storage: {
                    type: 'cookie',
                    name: 'waldo-pbjs-unifiedid',
                  },
                },
                {
                  name: 'pubCommonId',
                  storage: {
                    type: 'cookie',
                    name: 'waldo-pbjs-pubCommonId',
                  },
                },
              ],
              syncDelay: 3e3,
            },
          }),
          pbjs.addAdUnits(adUnits),
          pbjs.setConfig({
            userSync: {
              filterSettings: {
                all: {
                  bidders: ['aardvark'],
                  filter: 'include',
                },
              },
            },
          }),
          pbjs.requestBids({
            bidsBackHandler: function (e) {
              t('prebid');
            },
          });
      }),
      setTimeout(function () {
        d();
      }, 3e3);
  }
  function waldoInitCmp() {
    var e = waldoReadCookie('waldo_continent'),
      a = waldoReadCookie('euconsent');
    if ('EU' == e && null === a) {
      var t = document.createElement('script');
      (t.type = 'text/javascript'),
        (t.src =
          '//thisiswaldo.com/sites/all/modules/custom/ad_delivery/cmp/build/cmp.complete.bundle.js');
      var d = document.getElementsByTagName('head')[0];
      d.insertBefore(t, d.firstChild);
    }
  }
  function hb_sroll_pause(e) {
    for (var a = 0, t = allAdUnits.length; a < t; a++)
      e.slot.getSlotElementId() == allAdUnits[a].code &&
        allAdUnits[a].customParams.mobile_pause > 0 &&
        browserWidth < breakpoints.tablet &&
        ((document.documentElement.style.overflow = 'hidden'),
        (document.body.style.overflow = 'hidden'),
        (function (e) {
          setTimeout(function () {
            (document.documentElement.style.overflow = ''),
              (document.body.style.overflow = '');
          }, 1e3 * allAdUnits[e].customParams.mobile_pause);
        })(a));
  }
  function hb_refresh(e) {
    if (!refEn) return !1;
    for (var a = 0, t = adUnits.length; a < t; a++)
      e.slot.getSlotElementId() == allAdUnits[a].code &&
        'viewability' == allAdUnits[a].customParams.refresh.type &&
        (function (e) {
          setTimeout(function () {
            hbRefreshBid(allAdUnits[e]);
          }, 1e3 * allAdUnits[e].customParams.refresh.seconds);
        })(a);
  }
  function waldoAddCloseBtn(e) {
    for (var a = 0, t = adUnits.length; a < t; a++)
      if (
        e.slot.getSlotElementId() == adUnits[a].code &&
        adUnits[a].customParams.sticky_footer &&
        !e.isEmpty
      ) {
        var d = adUnits[a].customParams.slotNo,
          i = document.getElementById(e.slot.getSlotElementId()),
          s = i.getElementsByTagName('div')[0],
          r = s.getElementsByTagName('iframe')[0],
          o = r.getAttribute('width'),
          n = document.createElement('div');
        n.setAttribute('id', 'waldo-close-button'),
          (n.style.width = o + 'px'),
          (n.style.marginLeft = 'auto'),
          (n.style.marginRight = 'auto'),
          (n.style.textAlign = 'right'),
          (n.innerHTML =
            '<a style="text-decoration: none;" href="#">Close X</a>'),
          (r.style.width = o + 'px'),
          s.parentNode.insertBefore(n, s),
          (n.getElementsByTagName('a')[0].onclick = function (e) {
            e.preventDefault(),
              i.parentNode.removeChild(i),
              clearTimeout(waldoTimeOuts[d]);
          });
      }
  }
  function waldoPassbackInit(e) {
    for (var a = 0, t = adUnits.length; a < t; a++)
      if (
        e.slot.getSlotElementId() == adUnits[a].code &&
        adUnits[a].customParams.passback
      ) {
        var d = adUnits[a].customParams.passback,
          i = document.getElementById(
            'waldo-tag-' + adUnits[a].customParams.passback
          );
        if (e.isEmpty) {
          if ((r = document.getElementById(e.slot.getSlotElementId()))) {
            var s = r.getElementsByTagName('div')[0];
            r.removeChild(s);
          }
          if (!i) {
            var r = document.getElementById(e.slot.getSlotElementId()),
              o = waldoLoadPassback(adUnits[a].customParams.passback),
              n = document.createElement('div');
            n.setAttribute('id', o.code),
              r.parentNode.insertBefore(n, r),
              waldoInitTags([o]),
              googletag
                .pubads()
                .refresh([gptAdSlots[adUnits[a].customParams.passback]]),
              0 == adUnits[a].customParams.passback_refresh &&
                (clearTimeout(waldoTimeOuts[d]),
                clearTimeout(waldoTimeOuts[adUnits[a].customParams.slotNo]));
          }
        } else if (i) {
          waldoTimeOuts[d] && clearTimeout(waldoTimeOuts[d]);
          var m = document.getElementById(
            'waldo-tag-' + adUnits[a].customParams.passback
          );
          m && m.parentNode.removeChild(m);
        }
      }
  }
  function waldoInterstitialInit(e) {
    if (interstitialDone) return !1;
    for (var a = 0, t = adUnits.length; a < t; a++)
      if (
        e.slot.getSlotElementId() == adUnits[a].code &&
        adUnits[a].customParams.interstitial
      ) {
        interstitialDone = 1;
        var d = document.getElementById(adUnits[a].code);
        if (browserWidth >= breakpoints.desktop && !e.isEmpty) {
          var i = adUnits[a].customParams.interstitial_duration,
            s = document.createElement('div');
          s.setAttribute('id', 'waldo-counter'),
            (s.innerHTML =
              'Ad will close in <span class="count">' + i + '</span> seconds'),
            d.appendChild(s),
            (d.className = 'waldo-overlay'),
            (d.style.display = 'block');
          var r = d.getElementsByTagName('iframe')[0],
            o = d.getElementsByTagName('div')[0];
          (o.style.left = '50%'),
            (o.style.top = '50%'),
            (o.style.position = 'absolute'),
            (o.style.width = r.clientWidth + 'px'),
            (o.style.height = r.clientHeight + 'px'),
            (o.style.marginLeft = '-' + parseInt(r.clientWidth) / 2 + 'px'),
            (o.style.marginTop = '-' + parseInt(r.clientHeight) / 2 + 'px');
          var n = setInterval(function () {
            var e = i--;
            (s.getElementsByTagName('span')[0].innerHTML = e),
              0 == e && (clearInterval(n), d.parentNode.removeChild(d));
          }, 1e3);
        }
      }
  }
  function waldoInitTags(e) {
    var a,
      t = [];
    for (
      l = document.documentElement || document.body.parentNode || document.body,
        index = 0;
      index < e.length;
      ++index
    ) {
      var d = e[index],
        i = d.code,
        s = document.getElementById(i);
      if (s && void 0 === waldoTagsStatus[i]) {
        t.push(d.customParams.slotNo),
          (waldoTagsStatus[i] = 1),
          (bidDivAvailable = 1),
          (waldoAdRefreshes[d.customParams.slotNo] = 0);
        var r = document.createElement('script');
        if (
          ((r.type = 'text/javascript'),
          (r.text =
            "googletag.cmd.push(function() { googletag.display('" +
            i +
            "'); });"),
          s.appendChild(r),
          d.customParams.sticky_sidebar &&
            browserWidth >= breakpoints.desktop &&
            (a = s),
          d.customParams.sticky_footer
            ? (s.className = 'waldo-sticky-footer')
            : d.customParams.sticky_left || d.customParams.sticky_right
            ? browserWidth >= breakpoints.desktop
              ? d.customParams.sticky_left
                ? (s.className = 'waldo-bfleft')
                : (s.className = 'waldo-bfright')
              : (s.style.display = 'none')
            : d.customParams.interstitial && (s.style.display = 'none'),
          'min_max' == d.customParams.refresh.type)
        ) {
          var o = 1;
          browserWidth < breakpoints.desktop &&
            0 == d.customParams.mobile_refresh &&
            (o = 0),
            o && hbRandomMinMaxRefresh(e[index]);
        }
        s.setAttribute('data-processed', !0);
      }
      if (a && '/' != window.location.pathname) {
        var n,
          m = a.offsetTop,
          l =
            document.documentElement ||
            document.body.parentNode ||
            document.body,
          p = void 0 !== window.pageYOffset;
        (m += 550),
          (window.onscroll = function (e) {
            (n = p ? window.pageYOffset : l.scrollTop),
              (a.className = n >= m ? 'waldo-sticky-sidebar' : '');
          });
      }
    }
    !waldoImpressionDone &&
      t.length > 0 &&
      (waldoRecordImpression(t), (waldoImpressionDone = 1));
  }
  function hbRefreshBid(e) {
    var a = ['prebid'],
      t = [];
    if (
      ((t[e.customParams.slotNo] = { a9: !1, prebid: !1 }),
      5 == waldoAdRefreshes[e.customParams.slotNo])
    ) {
      e.bids;
      for (i = 0; i < e.bids.length; i++)
        ('openx' != e.bids[i].bidder &&
          'aol' != e.bids[i].bidder &&
          'sovrn' != e.bids[i].bidder) ||
          (pbjs.removeAdUnit(e.code),
          e.bids.splice(i, 1),
          pbjs.addAdUnits([e]));
    }
    pbjs.que.push(function () {
      pbjs.requestBids({
        timeout: PREBID_TIMEOUT,
        adUnitCodes: [e.code],
        bidsBackHandler: function (d) {
          !(function (d) {
            'a9' === d
              ? (t[e.customParams.slotNo].a9 = !0)
              : 'prebid' === d && (t[e.customParams.slotNo].prebid = !0);
            a
              .map(function (a) {
                return t[e.customParams.slotNo][a];
              })
              .filter(Boolean).length === a.length &&
              googletag.cmd.push(function () {
                pbjs.setTargetingForGPTAsync([e.code]),
                  googletag
                    .pubads()
                    .refresh([gptAdSlots[e.customParams.slotNo]]);
              });
          })('prebid');
        },
      });
    });
  }
  function hbRandomMinMaxRefresh(e) {
    if (browserWidth >= breakpoints.desktop)
      var a = parseInt(e.customParams.refresh.desktop.min),
        t = parseInt(e.customParams.refresh.desktop.max);
    else
      (a = parseInt(e.customParams.refresh.mobile.min)),
        (t = parseInt(e.customParams.refresh.mobile.max));
    var d = e.customParams.slotNo,
      i = parseInt(e.customParams.refresh.limit),
      s = getRandomNumber(a, t);
    waldoTimeOuts[d] = setTimeout(function () {
      waldoAdRefreshes[d] ? waldoAdRefreshes[d]++ : (waldoAdRefreshes[d] = 1),
        hbRefreshBid(e),
        waldoAdRefreshes[d] != i && hbRandomMinMaxRefresh(e);
    }, 1e3 * s);
  }
  function getRandomNumber(e, a) {
    return Math.floor(Math.random() * (a - e + 1) + e);
  }
  function waldoGeoBidsCheck(e) {
    for (i = 0; i < adUnits.length; i++) {
      var a = adUnits[i].bids;
      (a = a.filter(function (a) {
        return 'sovrn' != a.bidder
          ? 1
          : 'US' == e || 'CA' == e || 'GB' == e || 'AU' == e
          ? 1
          : void 0;
      })),
        (adUnits[i].bids = a);
    }
  }
  waldoInitScripts(),
    (pbjs.que = pbjs.que || []),
    pbjs.que.push(function () {
      pbjs.aliasBidder('appnexus', 'districtm'),
        pbjs.aliasBidder('appnexus', '9284');
    }),
    pbjs.que.push(function () {
      var e = window;
      (e._clrm = e._clrm || {}),
        (e._clrm.renderAd = e._clrm.renderAd || pbjs.renderAd);
      var a = e._clrm.prebid || { sandbox: 0 };
      e.confiant && e.confiant.settings && (a = e.confiant.settings);
      var t,
        d = function (e, a, t, d, i, s, r) {
          function o(e) {
            return (
              (e = (function (e) {
                if ('string' != typeof e) return e;
                var a = e.match(
                  /[^\u0000-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]/g
                );
                if (!a) return e;
                for (var t = 0; t < a.length; t++)
                  e = e.replace(a[t], encodeURIComponent(a[t]));
                return e;
              })(e)),
              (b(e) || '')[w]('/', '_')[w]('+', '-')
            );
          }
          function n(a, t, i, r) {
            var o = x + g(a) + '&d=' + t,
              n = 'err__' + 1 * new Date();
            c[n] = r;
            var m =
                '<' +
                f +
                ' type="text/java' +
                f +
                '">window["' +
                d +
                '"]={};window["' +
                d +
                '"]["tpid"]="' +
                a +
                '";window["' +
                d +
                '"]["' +
                a +
                '"]=' +
                u.stringify(i) +
                ';</' +
                f +
                '>',
              l =
                '<' +
                f +
                ' on' +
                v +
                '="void(' +
                n +
                '())" ' +
                h +
                '="' +
                o +
                '" type="text/java' +
                f +
                '" ></' +
                f +
                '>';
            s &&
              (l =
                '<' +
                f +
                ' on' +
                v +
                '="void(' +
                n +
                '())" " type="text/java' +
                f +
                '" >' +
                unescape(s) +
                '</' +
                f +
                '>'),
              e[I](m + l);
          }
          var m = a.bidder,
            l = null,
            p = a.size,
            c = e.parentWindow || e.defaultView,
            u = c.JSON,
            b = c.btoa,
            g = c.encodeURIComponent;
          if (!u || !b) return !1;
          var f = 'script',
            h = 'src',
            w = 'replace',
            v = 'error',
            k = 'stringify',
            I = 'write';
          t.indexOf('http') < 0 && (t = 'https://' + t);
          var x = t + '/?wrapper=' + g(d) + '&tpid=',
            y = { k: { hb_bidder: [m], hb_size: [p] } },
            _ = !1;
          return (
            window._clrm ||
              window.confiant ||
              (function () {
                function e(e) {
                  if ('string' == typeof e.data && e.data.indexOf('cb') > -1) {
                    var a = e.data.substr('cb'.length + d.length),
                      t = atob(a),
                      s = window.JSON.parse(t);
                    i.apply(this, s);
                  }
                }
                if (window.addEventListener)
                  try {
                    window.top.addEventListener('message', e, !1);
                  } catch (a) {
                    window.addEventListener('message', e, !1);
                  }
                else window.top.attachEvent('onmessage', e);
              })(),
            (function () {
              try {
                var t = {
                  wh: (l = o(
                    d + '/' + y.k.hb_bidder[0] + ':' + y.k.hb_size[0]
                  )),
                  wd: u.parse(u[k](y)),
                  wr: 0,
                };
                2 === r && (t.cb = 1e3 * Math.random());
                var s = {
                    prebid: { adId: a.adId, cpm: a.cpm },
                  },
                  m = !1;
                try {
                  m = !!c.frameElement.getAttribute('data-forced-sandbox');
                } catch (e) {}
                var p = {
                  d: t,
                  t: escape(a.ad),
                  isE: !0,
                  cb: i,
                  id: s,
                  isFSb: m,
                  devMode: r,
                };
                n(l, o(u[k](t)), p, function () {
                  e[I](a.ad);
                });
              } catch (e) {
                _ = !0;
                t = {
                  property_id: d,
                  uh: l || 'wt_not_established',
                  url:
                    window.location.href ||
                    window.top.location.href ||
                    document.url ||
                    'url not found',
                  label: 'confiantWrap_initialize',
                  msg: e.message,
                };
                var g = new XMLHttpRequest();
                g.open('POST', 'https://protected-by.clarium.io/werror', !0),
                  g.send(b(u.stringify(t)));
              }
            })(),
            e.close(),
            !_
          );
        },
        i = function (e) {
          return (
            'IFRAME' === e.tagName &&
            e.id &&
            e.id.indexOf('google_ads_iframe_') > -1
          );
        },
        s = function () {
          var e = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/i,
            t = /(.+)(iPhone|iPad|iPod)(.+)OS[\s|\_](\d)\_?(\d)?[\_]?(\d)?.+/i,
            d = /Android/i,
            i = '' + a.sandbox;
          return (
            '1' === i ||
            ('2' === i
              ? !navigator.userAgent.match(e)
              : '3' === i
              ? navigator.userAgent.match(e)
              : '4' === i
              ? navigator.userAgent.match(t)
              : '5' === i && navigator.userAgent.match(d))
          );
        };
      s() &&
        (Node.prototype.appendChild =
          ((t = Node.prototype.appendChild),
          function (e) {
            return (
              i(e) &&
                s() &&
                !e.getAttribute('sandbox') &&
                (e.setAttribute(
                  'sandbox',
                  'allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation'
                ),
                e.setAttribute('data-forced-sandbox', !0)),
              t.call(this, e)
            );
          })),
        (pbjs.renderAd = function (e, t) {
          if (e && t)
            try {
              var i,
                s,
                r = [],
                o = pbjs.getBidResponses(),
                n = pbjs.getHighestCpmBids();
              for (var m in o) r = r.concat(o[m].bids);
              for (r = r.concat(n), s = 0; s < r.length; s++)
                if (r[s].adId === t) {
                  i = r[s];
                  break;
                }
              var l = a.excludeBidders || [];
              if (i) {
                var p = !1;
                for (s = 0; s < l.length; s++)
                  if (i.bidder === l[s]) {
                    p = !0;
                    break;
                  }
              }
              if (i && i.ad && !p) {
                e.write, e.close;
                (e.write = e.close = function () {}),
                  window._clrm.renderAd(e, t),
                  delete e.write,
                  delete e.close;
                var c =
                  'undefined' == typeof getSerializedCaspr
                    ? null
                    : getSerializedCaspr();
                return void (
                  d(
                    e,
                    i,
                    'clarium.global.ssl.fastly.net',
                    'bbdvOAJnqH-Idffgn_02C2Cyx_E',
                    function (e, a, t, d, i, s) {
                      console.log('w00t one more bad ad nixed.', arguments);
                    },
                    c,
                    a.devMode
                  ) || (e.write(i.ad), e.close())
                );
              }
            } catch (e) {
              console.error(e);
            }
          window._clrm.renderAd(e, t);
        }),
        pbjs.setConfig({
          schain: {
            validation: 'off',
            config: {
              ver: '1.0',
              complete: 1,
              nodes: [{ asi: 'newormedia.com', sid: '4645', hp: 1 }],
            },
          },
        });
    }),
    0 == bidDivAvailable &&
      (document.addEventListener(
        'DOMContentLoaded',
        function () {
          adTagsInitFlag || (waldoInitTags(adUnits), (adTagsInitFlag = 1));
        },
        !1
      ),
      window.addEventListener(
        'load',
        function () {
          adTagsInitFlag || (waldoInitTags(adUnits), (adTagsInitFlag = 1));
        },
        !1
      )),
    setTimeout(function () {
      refEn = 1;
    }, 3e4),
    null === waldoCountry
      ? waldoGetUserData()
      : (waldoInitCmp(), fetchHeaderBids());
}
function waldoDisplayPassbacksBlockedPages() {
  for (var e = 0; e < adUnits.length; e++) {
    var a = adUnits[e],
      t = document.getElementById(a.code);
    if (t) {
      var d = waldoLoadPassback(a.customParams.passback),
        i = document.createElement('div');
      i.setAttribute('id', d.code),
        a.customParams.sticky_footer && (i.className = 'waldo-sticky-footer'),
        t.parentNode.insertBefore(i, t);
      var s = document.createElement('script');
      (s.type = 'text/javascript'),
        (s.text =
          "googletag.cmd.push(function() { googletag.display('" +
          d.code +
          "'); });"),
        i.appendChild(s),
        googletag.cmd.push(function () {
          googletag.pubads().refresh([gptAdSlots[a.customParams.passback]]);
        }),
        console.log('ref');
    }
  }
}
function waldoGetUserData() {
  var e = 'https:' == document.location.protocol,
    a =
      (new XMLHttpRequest(),
      (e ? 'https:' : 'http:') +
        '//ipfind.co/me?auth=3757a9b9-5759-4813-bc1a-7fa0b8ba94c1'),
    t = new XMLHttpRequest();
  (t.onreadystatechange = function () {
    if (t.readyState === XMLHttpRequest.DONE)
      if (200 === t.status) {
        var e = JSON.parse(t.responseText);
        waldoCreateCookie('waldo_country', e.country_code, 90),
          waldoCreateCookie('waldo_continent', e.continent_code, 90),
          waldoInitCmp(),
          waldoGeoBidsCheck(e.country_code),
          fetchHeaderBids();
      } else waldoInitCmp(), waldoGeoBidsCheck(''), fetchHeaderBids();
  }),
    t.open('GET', a, !0),
    (t.timeout = 550),
    t.send();
}
function waldoLoadPassback(e) {
  for (i = 0; i < passbackAdUnits.length; i++)
    if (passbackAdUnits[i].customParams.slotNo == e) return passbackAdUnits[i];
}
function waldoCreateCookie(e, a, t) {
  var d = '';
  if (t) {
    var i = new Date();
    i.setTime(i.getTime() + 24 * t * 60 * 60 * 1e3),
      (d = '; expires=' + i.toUTCString());
  }
  document.cookie = e + '=' + a + d + '; path=/';
}
function waldoReadCookie(e) {
  for (
    var a = e + '=', t = document.cookie.split(';'), d = 0;
    d < t.length;
    d++
  ) {
    for (var i = t[d]; ' ' == i.charAt(0); ) i = i.substring(1, i.length);
    if (0 == i.indexOf(a)) return i.substring(a.length, i.length);
  }
  return null;
}
function waldoEmailDetected(e) {
  var a = new XMLHttpRequest(),
    t = 'url=' + e;
  a.open('POST', 'https://thisiswaldo.com/email-detected', !0),
    a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'),
    a.send(t);
}
function waldoRecordImpression(e) {
  var a = e.join(','),
    t = 'https:' == document.location.protocol,
    d = new XMLHttpRequest(),
    i = (t ? 'https:' : 'http:') + '//thisiswaldo.com/new-impression',
    s = 'site_id=' + siteId + '&zone_ids=' + a;
  d.open('POST', i, !0),
    d.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'),
    d.send(s);
}
var waldo = waldo || {};
(waldo.refreshTag = function (e) {
  for (var a = 0; a < adUnits.length; a++)
    adUnits[a].code == e && hbRefreshBid(adUnits[a]);
}),
  (waldo.refreshAllTags = function () {
    fetchHeaderBids();
  });
