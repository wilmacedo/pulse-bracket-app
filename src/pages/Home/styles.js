import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;

  justify-content: center;
  align-items: center;

  background-color: white;
`;

export const Title = styled.Text`
  margin: 10px;

  font-size: 20px;
  text-align: center;
`;

export const Information = styled.Text`
  margin-bottom: 5px;

  color: #333;
  text-align: center;
`;

export const Status = styled.Text`
  color: ${props => (props.isConnected ? 'green' : '#333')};
  opacity: ${props => (props.isConnected ? 1 : 0.5)};
`;

export const Input = styled.TextInput`
  padding: 5px 10px;

  width: 300px;

  border: 1px solid gray;
  border-radius: 5px;
`;

export const Button = styled.Button``;
