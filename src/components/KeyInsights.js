import React from 'react';
import styled from 'styled-components';
import SettlementFactorsChart from './SettlementFactorsChart';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 28px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const InsightCard = styled.div`
  background: linear-gradient(135deg, ${props => props.$bgColor1} 0%, ${props => props.$bgColor2} 100%);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${props => props.$borderColor};
`;

const InsightLabel = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
`;

const InsightValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.$color || '#2c3e50'};
  margin-bottom: 8px;
`;

const InsightDescription = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.4;
`;



function KeyInsights({ regionData, modelData }) {
  if (!regionData || regionData.length === 0 || !modelData) {
    return null;
  }

  // 전국 평균 계산
  const avgSettlementRate = (
    regionData.reduce((sum, r) => sum + (r.settlement_rate || 0), 0) / regionData.length
  ).toFixed(1);

  // 정착률 범위 분석
  const settlementRates = regionData.map(r => r.settlement_rate || 0);
  const maxRate = Math.max(...settlementRates).toFixed(1);
  const minRate = Math.min(...settlementRates).toFixed(1);

  // 요인별 중요도는 이제 SettlementFactorsChart 컴포넌트에서 처리

  // 최고 정착률 지역
  const topRegion = regionData.reduce((max, r) => 
    (r.settlement_rate || 0) > (max.settlement_rate || 0) ? r : max
  , regionData[0]);

  return (
    <Container>
      <Title>📊 핵심 인사이트</Title>
      
      <InsightGrid>
        <InsightCard 
          $bgColor1="#e3f2fd" 
          $bgColor2="#bbdefb" 
          $borderColor="#2196f3"
        >
          <InsightLabel>전국 평균 정착률</InsightLabel>
          <InsightValue $color="#1976d2">{avgSettlementRate}%</InsightValue>
          <InsightDescription>
            전국 {regionData.length}개 지역 평균
          </InsightDescription>
        </InsightCard>

        <InsightCard 
          $bgColor1="#e8f5e9" 
          $bgColor2="#c8e6c9" 
          $borderColor="#4caf50"
        >
          <InsightLabel>최고 정착률 지역</InsightLabel>
          <InsightValue $color="#2e7d32">{maxRate}%</InsightValue>
          <InsightDescription>
            {topRegion.region_name_sido} {topRegion.region_name_sigungu}
          </InsightDescription>
        </InsightCard>

        <InsightCard 
          $bgColor1="#fff3e0" 
          $bgColor2="#ffe0b2" 
          $borderColor="#ff9800"
        >
          <InsightLabel>정착률 편차</InsightLabel>
          <InsightValue $color="#ef6c00">{(maxRate - minRate).toFixed(1)}%</InsightValue>
          <InsightDescription>
            최고 {maxRate}% ~ 최저 {minRate}%
          </InsightDescription>
        </InsightCard>

      </InsightGrid>

      <SettlementFactorsChart />
    </Container>
  );
}

function getFactorDisplayName(factor) {
  const displayNames = {
    'support_program_participants': '지원 프로그램 참여자 수',
    'young_farmers_2023': '기존 청년농업인 수',
    'policy_satisfaction': '정책 만족도',
'land_availability_score': '토지 가용성',
    'agricultural_technology_score': '농업 기술 수준',
    'community_support_score': '커뮤니티 지원'
  };
  return displayNames[factor] || factor;
}

export default KeyInsights;
