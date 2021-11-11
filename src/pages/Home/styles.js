import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;

  background-color: ${props => props.theme.background};
`;

export const Header = styled.View`
  padding: 15px;

  flex-direction: row;

  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CardContainer = styled.View`
  padding: 10px 10px 0px 10px;
  margin: 15px;

  background-color: white;
  border-radius: 16px;
`;

export const HearhCardContainer = styled(CardContainer)`
  padding: 20px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HearthContent = styled.View`
  flex-direction: row;

  align-items: center;
`;

export const HearthHeader = styled.View`
  margin-left: 8px;

  flex-direction: column;
`;
