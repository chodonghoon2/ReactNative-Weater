import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width : SCREEN_WIDTH } = Dimensions.get("window");
//위는 ES6문법을 활용한 방법 아래는 원래 쓰던 방식
//const SCREEN_WIDTH = Dimensions.get("window").width;
//console.log(SCREEN_WIDTH);

//날씨 API 키 OpenWeater : https://openweathermap.org/
const API_KEY = "YOUR API KEY";

//아이콘
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}

export default function App() {
  //Loacation API를 통한 사용자 위치 얻어와서 저장하기 위한 useState
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  
  //OpenWeater : https://openweathermap.org/
  //날씨 API를 통해 가져오는 날씨 정보 저장하는 useState
  const [days, setDays] = useState([]);

  const getWeather = async() => {
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
    const response =  await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather;
        }
      })
    );
  }

  useEffect(() => {
    getWeather();
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
        {days.length === 0 ? 
          (<View style={{...styles.day, alignItems:"center"}}>
            {/* 로딩 보여주는 컴포넌트 */}
            <ActivityIndicator 
              color="white" 
              size="large" 
              style={{marginTop:10}}
            />
          </View>
          ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.today}>
                {day.dt_txt.split(" ")[0]}
              </Text>
              <View style={{flexDirection:"row", alignItems:"center", width:"100%", justifyContent:"space-between"}}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}º
                </Text> 
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
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
    flex : 1.3,
    backgroundColor:"tomato",
    justifyContent:"center",
    alignItems:"center"
  },
  cityName : {
    color: "white",
    fontSize:48,
    fontWeight:"500",
  },
  weater : {
    // ScorllView는 flex를 줄 필요가 없다 -> 화면보다 더 커야하기 때문에 크기를 정해주면 안된다.
  },
  day: {
    width:SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp : {
    fontSize:178,
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
    marginLeft:10
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
    marginLeft:10
  },
  today: {
    color:"white",
    fontSize:20,
    marginLeft:10
  }
}) 