import { View, Text, Button, Video } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import "./index.scss";
import { useState, useEffect } from "react";
import { auth, login } from "@/services/wx-service";
import { getVideoInfo } from "@/services/video-service";
import md5 from "js-md5";

interface IIndexProps {}

const Index: React.FunctionComponent<IIndexProps> = (props) => {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isShowBtn, setIsShowBtn] = useState(false);
  const [savePath, setSavePath] = useState("");
  const [startLoading, setStartLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  useShareAppMessage(() => {
    return {
      path: "/pages/index/index?share=true",
    };
  });

  useEffect(() => {
    Taro.login({
      success: (res) => {
        auth(res.code).then((openId) => {
          Taro.setStorageSync("openId", openId);
          login().then((loginInfo) => {});
        });
      },
    });
  }, []);

  const toHistory = () => {
    setIsShowBtn(false);
    Taro.navigateTo({
      url: "/pages/history/index",
    });
  };
  const toHelp = () => {
    Taro.navigateTo({
      url: "/pages/help/index",
    });
  };
  const getUrl = () => {
    Taro.getClipboardData().then((res) => {
      if (res.data) {
        if (regUrl(res.data)) {
          setUrl(res.data);
        } else {
          Taro.showToast({
            title: "请复制短视频平台分享链接后再来",
            icon: "none",
            duration: 2000,
            mask: true,
          });
        }
      }
    });
  };

  const regUrl = (urlStr) => {
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
      urlStr
    );
  };

  const findUrlByStr = (urlStr) => {
    let urls = urlStr.match(
      /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
    );
    if (urls) {
      return urls[0];
    }
    return "";
  };

  const start = () => {
    var urlNoText = findUrlByStr(url);
    getVideoInfo(urlNoText).then((res) => {
      setStartLoading(false);

      var path = `${Taro.env.USER_DATA_PATH}/${md5(res.url)}.mp4`;
      let fileSys = Taro.getFileSystemManager();
      fileSys.access({
        path: path,
        success: () => {
          setIsDownload(true);
        },
        fail: () => {
          setIsDownload(false);
        },
      });
      setSavePath(path);
      setVideoUrl(res.url);
    });
  };

  const download = (clallBack) => {
    setSaveLoading(true);
    let fileSys = Taro.getFileSystemManager();
    fileSys.access({
      path: savePath,
      success: (info) => {
        setSaveLoading(false);
        clallBack(savePath);
      },
      fail: (err) => {
        var openId = Taro.getStorageSync("openId");
        var downUrl =
          process.env.HOST +
          "video/down?openId=" +
          openId +
          "&url=" +
          encodeURI(videoUrl);

        Taro.downloadFile({
          url: downUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              fileSys.saveFile({
                tempFilePath: res.tempFilePath,
                filePath: savePath,
                success: (file) => {
                  setIsDownload(true);
                  clallBack(savePath);
                },
              });
            }
          },
        });
      },
    });
  };

  const shareFile = () => {
    if(isDownload){
      Taro.shareFileMessage({
        filePath: savePath,
        success() {},
        fail(error) {
          Taro.showToast({
            title: error.errMsg,
            icon: "none",
            duration: 2000,
            mask: true,
          });
        },
      });
    }else{
      Taro.showToast({ title: "正在下载视频...", icon: "none", duration: 2000, mask: true });
      download(()=>{
        Taro.showToast({ title: "视频下载成功，可以分享了", icon: "none", duration: 2000, mask: true });
        setSaveLoading(false);
      });
    }

  };
  const saveVideo = (path) => {
    Taro.getSetting({
      success: (setting) => {
        if (setting.authSetting["scope.writePhotosAlbum"]) {
          Taro.saveVideoToPhotosAlbum({
            filePath: path,
            success: () => {
              setSaveLoading(false);
              Taro.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000,
              });
            },
          });
        } else {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            success: () => {
              Taro.saveVideoToPhotosAlbum({
                filePath: path,
                success: () => {
                  setSaveLoading(false);
                  Taro.showToast({
                    title: "保存成功",
                    icon: "success",
                    duration: 2000,
                  });
                },
              });
            },
            fail: (fail) => {
              Taro.showModal({
                title: "提示",
                content: "视频保存到相册需获取相册权限请允许开启权限",
                confirmText: "确认",
                cancelText: "取消",
                success: (res) => {
                  if (res.confirm) {
                    Taro.openSetting({
                      success: () => {},
                    });
                  }
                },
              });
            },
          });
        }
      },
    });
  };

  return (
    <View className="index padding-40">
      <View className="urlInput margin-20 min-height-160">
        {url ? (
          <View className="hasurl min-height-160">
            <View
              className="flex flex-1 padding-20"
              onClick={() => {
                setIsShowBtn(true);
              }}
            >
              <Text className="url ">{url}</Text>
            </View>
            {isShowBtn ? (
              <View className="btns-warp flex flex-row justify-center align-center ">
                <View className="btns">
                  <Button
                    onClick={() => {
                      setIsShowBtn(false);
                      Taro.setClipboardData({ data: url });
                    }}
                    className="copy"
                    size="mini"
                  >
                    复制
                  </Button>
                  <Button
                    onClick={() => {
                      setUrl("");
                      setIsShowBtn(false);
                    }}
                    className="clear"
                    size="mini"
                  >
                    清空
                  </Button>
                  {/* <Button onClick={toHistory} className="history" size="mini">
                    历史
                  </Button> */}
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <View
            className="flex flex-row justify-center align-center min-height-160"
            onClick={getUrl}
          >
            <View className="flex flex-col">
              <Text>点击此区域粘贴链接地址</Text>
              <Text className="tips">提示：再次点击可清空或复制链接</Text>
            </View>
          </View>
        )}
      </View>
      <View>
        <Button
          loading={startLoading}
          onClick={start}
          disabled={!url}
          className="margin-20 start "
        >
          解析视频
        </Button>
      </View>

      {videoUrl ? (
        <View className="flex flex-col margin-top-30">
          <View className="flex justify-center align-center ">
            <Video style={{ height: "360rpx" }} src={videoUrl} />
          </View>
          <View className="flex margin-top-30 padding-10  justify-between  align-center ">
            <Button
              onClick={shareFile}
              className="btn-line"
              style={{ width: "120px" }}
            >
              分享视频
            </Button>
            <Button
              onClick={() => {
                Taro.setClipboardData({ data: videoUrl }).then(() => {});
              }}
              className="btn-line"
              style={{ width: "120px" }}
            >
              复制视频地址
            </Button>
          </View>
          <View className="flex padding-10 justify-center align-center ">
            <Button
              loading={saveLoading}
              onClick={() => {
                download((path) => {
                  saveVideo(path);
                });
              }}
              style={{ width: "284px" }}
            >
              保存至相册
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex flex-col help">
          <Text className="title">使用说明</Text>
          <View className="flex flex-col  padding-20">
            <Text className="text">
              1、打开短视频APP，在视频界面找到分享按钮
            </Text>
            <Text className="text">2、点击“复制链接”</Text>
            <Text className="tips">
              (无“复制链接”可通过分享到微信QQ等获取分享链接)
            </Text>
            <Text className="text">
              3、回到小程序,点击顶部虚线区域粘贴链接地址
            </Text>
            <Text className="text">
              4、点击上方“解析视频”按钮即可获得无水印视频
            </Text>
          </View>
        </View>
      )}

      <View>
        <Text className="text">解析遇到问题，试试先查看</Text>
        <Text className="text a" onClick={toHelp}>
          常见问题
        </Text>
      </View>
    </View>
  );
};

export default Index;
