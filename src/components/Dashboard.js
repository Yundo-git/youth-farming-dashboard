import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RegionBenchmark from './RegionBenchmark';
import InvestmentAnalyzer from './InvestmentAnalyzer';
import KeyInsights from './KeyInsights';

const DashboardContainer = styled.div`
  width: 100%;
  padding: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 12px 8px;
  }
`;

const Header = styled.header`
  text-align: center;
  padding: 30px 16px;
  color: white;
  margin: 0 -16px 24px -16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  width: calc(100% + 32px);
  
  @media (max-width: 768px) {
    padding: 20px 12px;
    margin: 0 -12px 20px -12px;
    width: calc(100% + 24px);
  }
`;

const Title = styled.h1`
  font-size: 32px;
  margin: 0 0 12px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  padding: 0 10px;
  word-break: keep-all;
  
  @media (min-width: 768px) {
    font-size: 40px;
  }
  
  @media (min-width: 1024px) {
    font-size: 48px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin: 8px 0;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  line-height: 1.4;
  padding: 0 10px;
  word-break: keep-all;
  
  @media (min-width: 768px) {
    font-size: 20px;
  }
  
  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;

const PurposeBox = styled.div`
  background: white;
  padding: 24px 16px;
  margin: 0 0 24px 0;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 28px 24px;
    margin: 0 0 30px 0;
  }
  
  @media (min-width: 1024px) {
    padding: 32px 40px;
  }
`;

const PurposeTitle = styled.h3`
  color: #2c3e50;
  font-size: 20px;
  margin: 0 auto 16px auto;
  text-align: center;
  display: block;
  font-weight: 600;
  position: relative;
  width: fit-content;
  padding: 0 16px;
  line-height: 1.4;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    border-radius: 2px;
    background: #667eea;
  }
  
  @media (min-width: 768px) {
    font-size: 22px;
    margin-bottom: 18px;
  }
  
  @media (min-width: 1024px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const PurposeText = styled.p`
  color: #34495e;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 4px;
  text-align: center;
  word-break: keep-all;
  
  @media (min-width: 480px) {
    font-size: 15px;
    padding: 0 8px;
  }
  
  @media (min-width: 768px) {
    font-size: 16px;
    padding: 0 12px;
    text-align: left;
  }
  
  @media (min-width: 1024px) {
    max-width: 1200px;
    padding: 0 20px;
  }
  
  strong {
    display: inline-block;
    margin: 8px 0;
    line-height: 1.7;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  color: #555;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #fff5f5;
  border: 2px solid #e74c3c;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  color: #e74c3c;
`;

const SectionContainer = styled.div`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

function Dashboard() {
  const [regionData, setRegionData] = useState([]);
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 두 지점 간 거리 계산 (Haversine formula) 함수는 useEffect 외부에 유지
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    // 지역 데이터 강화 함수를 useEffect 내부로 이동
    const enrichRegionData = (regions) => {
      return regions.map(region => {
        // 대도시 근접성 계산 (서울, 부산, 대구, 인천, 광주, 대전 기준)
        const majorCities = {
          '서울': { lat: 37.5665, lng: 126.9780 },
          '부산': { lat: 35.1796, lng: 129.0756 },
          '대구': { lat: 35.8714, lng: 128.6014 },
          '인천': { lat: 37.4563, lng: 126.7052 },
          '광주': { lat: 35.1595, lng: 126.8526 },
          '대전': { lat: 36.3504, lng: 127.3845 }
        };

        let minDistance = Infinity;
        let nearestCity = '';

        Object.entries(majorCities).forEach(([city, coords]) => {
          const distance = calculateDistance(
            region.latitude, 
            region.longitude, 
            coords.lat, 
            coords.lng
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
          }
        });

        // 근접성 등급 (A: 30km 이내, B: 30-60km, C: 60-100km, D: 100km 이상)
        let proximityGrade = 'D';
        if (minDistance < 30) proximityGrade = 'A';
        else if (minDistance < 60) proximityGrade = 'B';
        else if (minDistance < 100) proximityGrade = 'C';

        // 종합 인프라 점수 계산
        const infrastructureScore = (
          (region.land_availability_score || 0) * 0.3 +
          (region.agricultural_technology_score || 0) * 0.35 +
          (region.community_support_score || 0) * 0.35
        );

        return {
          ...region,
          infrastructure_score: infrastructureScore,
          proximity_to_city: minDistance,
          proximity_grade: proximityGrade,
          nearest_major_city: nearestCity
        };
      });
    };
    
    const loadData = async () => {
      try {
        // 지역 데이터 로드
        const regionResponse = await fetch('/region_settlement_data.json');
        if (!regionResponse.ok) throw new Error('지역 데이터를 불러올 수 없습니다.');
        const regions = await regionResponse.json();
        
        // 모델 데이터 로드
        const modelResponse = await fetch('/settlement_prediction_model.json');
        if (!modelResponse.ok) throw new Error('모델 데이터를 불러올 수 없습니다.');
        const model = await modelResponse.json();
        
        // 지역별 인프라 점수 및 대도시 근접성 계산
        const enrichedRegions = enrichRegionData(regions); // 이제 내부 함수 호출
        
        setRegionData(enrichedRegions);
        setModelData(model);
        setLoading(false);
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [ /* 의존성 배열은 비워두어 컴포넌트 마운트 시 한 번만 실행되도록 유지 */ ]);

  // ❌ 기존에 useEffect 외부에 있던 enrichRegionData 함수는 삭제됨

  if (loading) {
    return (
      <DashboardContainer>
        <Header>
          <Title>🌾 청년 농업인 정착률 향상 시뮬레이터</Title>
          <Subtitle>데이터 기반 정책 투자 의사결정 지원 시스템</Subtitle>
        </Header>
        <LoadingMessage>데이터를 불러오는 중입니다... ⏳</LoadingMessage>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <Title>🌾 청년 농업인 정착률 향상 시뮬레이터</Title>
          <Subtitle>데이터 기반 정책 투자 의사결정 지원 시스템</Subtitle>
        </Header>
        <ErrorMessage>
          ⚠️ {error}<br />
          데이터를 불러오는 중 오류가 발생했습니다.
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>🌾 청년 농업인 정착률 향상 시뮬레이터</Title>
        <Subtitle>데이터 기반 정책 투자 의사결정 지원 시스템</Subtitle>
        
        <PurposeBox>
          <PurposeTitle>🎯 시스템 목적</PurposeTitle>
          <PurposeText>
            <strong>"우리 지역의 청년 농업인 정착률을 높이기 위해, 어떤 요인에 투자하는 것이 가장 효과적이며, 
            우리와 조건이 비슷한 어떤 지역을 벤치마킹해야 하는가?"</strong>
            <br/><br/>
            정책 결정권자와 실무자가 예산 투자 및 개선 영역을 데이터 기반으로 결정할 수 있도록 돕는 
            정책 시뮬레이션 도구입니다.
          </PurposeText>
        </PurposeBox>
      </Header>

      <SectionContainer>
        <KeyInsights regionData={regionData} modelData={modelData} />
      </SectionContainer>
      
      <SectionContainer>
        <InvestmentAnalyzer regionData={regionData} modelData={modelData} />
      </SectionContainer>
      
      <SectionContainer>
        <RegionBenchmark regionData={regionData} />
      </SectionContainer>

      <SectionContainer>
        {/*<PolicySimulator regionData={regionData} modelData={modelData} />*/}
      </SectionContainer>
    </DashboardContainer>
  );
}

export default Dashboard;