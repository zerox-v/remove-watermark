import { View, Text, Button } from "@tarojs/components";
import "./index.scss";

interface IHelpProps {}

const Help: React.FunctionComponent<IHelpProps> = (props) => {
  return (
    <View className="help">
      <View className="flex flex-col card margin-40 padding-20">
        <Text className="title">视频解析收费吗?会限制次数吗?</Text>
        <Text className="p">
          解析服务完全免费,不限次(可根据需要自行提升日上限)
        </Text>
        <Text className="title">为什么下载后的视频,还是有水印?</Text>
        <Text className="p">
          视频去水印仅能去掉以官网方式下载时打上的水印,
          对于源视频是二次上传的视频无法去水印
        </Text>
        <Text className="title">什么是二次上传,怎么判断?</Text>
        <View className="p flex flex-col">
          <Text className="tips">
            二次上传是指用户直接从视频平台APP下载视频,然
            后又再次上传到视频平台;判断方法一般有两个:
          </Text>

          <Text className="tips">
            1.视频平台APP内播放视频,有平台水印就是二次上传的
          </Text>
          <Text className="tips">
            2.在浏览器内打开视频分享链接,如果视频中有多个平台水印也是二次上传的
          </Text>
        </View>
        <Text className="title">解析后的视频含水印或解析失败?</Text>
        <Text className="p">
          通常这种情况为解析到的真实地址包含了多个,服务随机返回其中之一,被分配到了一个无效或不可用的地址,此时可多次尝试解析即可
        </Text>
        <Text className="title">提示下载成功,但相册找不到下载文件?</Text>
        <Text className="p">安卓手机下载后素材,很有可能在“文件管理”模块</Text>
        <Text className="title">提示下载失败,或无响应?</Text>
        <Text className="p">
          请确保程序授权管理中各项权限已打开,可点击右上角…·按钮进入设置中查看。若赋予权限后仍出现无法下载情况,大部分原因是由于微信官方限制,小程序下载的文件大小不能超过10M
        </Text>

        <View>
        <Button openType="contact">联系我们</Button>
        </View>

      </View>
    </View>
  );
};

export default Help;
