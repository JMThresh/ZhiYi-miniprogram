// Promise 形式 getSetting
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => { }
        });
    })
}

// Promise 形式 chooseAddress
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => { }
        });
    })
}
// Promise 形式 openSetting
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => { }
        });
    })
}

// Promise 形式 getLocation
export const getLocation = () => {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'wgs84',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => { }
        });
    })
}



/**
 * Promise 形式 showModal
 * @param {object} param0 参数
 */

// Promise 形式 authorize
export const authorize = ({ name }) => {
    return new Promise((resolve, reject) => {
        wx.authorize({
            scope: name,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
    
}

export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/**
 * Promise 形式 showToast
 * @param {object} param0 参数
 */
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            duration: 1500,
            icon: 'none',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

/**
 * Promise 形式 navigateTo
 * @param {object} param0 参数
 */
export const navigateTo = ({ url }) => {
    return new Promise((resolve, reject) => {
        wx.navigateTo({
            url: url,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

/**
 * Promise 形式 login
 */
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

/**
 * Promise 形式的  小程序的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    })
}