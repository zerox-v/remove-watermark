import { View, Text } from '@tarojs/components'
import './index.scss'

interface IHistoryProps {
}

const History: React.FunctionComponent<IHistoryProps> = (props) => {
  return <View className='history'>
  <Text>Hello world!</Text>
</View>;
};

export default History;

