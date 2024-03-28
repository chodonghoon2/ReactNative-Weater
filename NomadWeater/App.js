import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width : SCREEN_WIDTH } = Dimensions.get("window");
//위는 ES6문법을 활용한 방법 아래는 원래 쓰던 방식
//const SCREEN_WIDTH = Dimensions.get("window").width;
//console.log(SCREEN_WIDTH);

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);

  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false); // 유저가 위치를 허가하지 않았을 시
    }
    // const location = await Location.getCurrentPositionAsync({accuracy:5});
    /*
      {"coords": {"accuracy": 35, "altitude": 43.81156539916992, "altitudeAccuracy": 4.836819171905518, "heading": -1, "latitude": 37.61960860696488, "longitude": 127.07601484138704, "speed": -1}, "timestamp": 1711642938667.495}
    */
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5}); //위도 경도 가져오기
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps:false}
    );
    setCity(location[0].city);
  }

  useEffect(() => {
    ask();
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/* ScrollView는 View와 다르게 Style을 적용하기 위해서는 contentContainerStyle을 사용해야한다. */}
      <ScrollView 
        horizontal //스크롤을 수평으로 할 수 있게 만들어주는 옵션 default는 수직
        pagingEnabled //스크롤시 엘리먼트 하나당 페이지를 만들어주는 옵션
        showsHorizontalScrollIndicator={false} // 스크롤시 하단의 작게 표시되는데 그거 없애는 옵션
        contentContainerStyle={styles.weater}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : "tomato"
  },
  city : {
    flex : 1.2,
    backgroundColor:"tomato",
    justifyContent:"center",
    alignItems:"center"
  },
  cityName : {
    color:"#ffffff",
    fontSize:48,
    fontWeight:"500",
  },
  weater : {
    // ScorllView는 flex를 줄 필요가 없다 -> 화면보다 더 커야하기 때문에 크기를 정해주면 안된다.
  },
  day: {
    width:SCREEN_WIDTH,
    alignItems:"center",
  },
  temp : {
    marginTop:50,
    fontSize:178,
  },
  description: {
    marginTop:-30,
    fontSize:60,
  }
}) 