import React, { useState, useEffect, useCallback } from 'react'; // 👈 useCallback import 추가
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 28px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Description = styled.p`
  color: #7f8c8d;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const RegionSelector = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #34495e;
  font-size: 18px;
`;

const Select = styled.select`
  width: 100%;
  max-width: 500px;
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid ${props => props.$hasValue ? '#3498db' : '#e0e0e0'};
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #3498db;
  }

  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  height: 400px;
`;

const RecommendationsPanel = styled.div`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RecommendationCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid ${props => {
    if (props.$priority === 'high') return '#e74c3c';
    if (props.$priority === 'medium') return '#f39c12';
    return '#3498db';
  }};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background: ${props => {
    if (props.$priority === 'high') return '#e74c3c';
    if (props.$priority === 'medium') return '#f39c12';
    return '#3498db';
  }};
  color: white;
  margin-right: 8px;
`;

const RecommendationTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const RecommendationText = styled.div`
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.6;
  margin-top: 8px;
`;

const ImpactMetrics = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const Metric = styled.div`
  background: #f0f9ff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
`;

const MetricLabel = styled.span`
  color: #7f8c8d;
`;

const MetricValue = styled.span`
  font-weight: 600;
  color: #2c3e50;
  margin-left: 6px;
`;

const GapAnalysisContainer = styled.div`
  background: linear-gradient(135deg, #fff5e6 0%, #ffe0b2 100%);
  padding: 24px;
  border-radius: 12px;
  margin-top: 24px;
`;

const GapTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #e67e22;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GapList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GapItem = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GapName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
`;

const GapValue = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #e74c3c;
  background: #fff5f5;
  padding: 6px 12px;
  border-radius: 6px;
`;

function InvestmentAnalyzer({ regionData, modelData }) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // 1. performAnalysis 함수를 useCallback으로 감싸서 의존성 목록에 넣을 수 있도록 준비
  const performAnalysis = useCallback(() => {
    const region = regionData.find(r => 
      `${r.region_name_sido}-${r.region_name_sigungu}` === selectedRegion
    );

    if (!region) return;

    // 전국 평균 계산
    const nationalAvg = {};
    const factors = [
      'support_program_participants',
      'young_farmers_2023',
      'policy_satisfaction',
      'average_income',
      'land_availability_score',
      'agricultural_technology_score',
      'community_support_score'
    ];

    factors.forEach(factor => {
      nationalAvg[factor] = regionData.reduce((sum, r) => sum + (r[factor] || 0), 0) / regionData.length;
    });

    // 갭 분석
    const gaps = factors.map(factor => {
      const current = region[factor] || 0;
      const average = nationalAvg[factor];
      const gap = average - current;
      const gapPercent = average > 0 ? (gap / average) * 100 : 0;
      const importance = modelData.feature_importance[factor] || 0;
      
      return {
        factor,
        current,
        average,
        gap,
        gapPercent,
        importance,
        priority: importance * Math.abs(gapPercent) // 중요도 × 갭 비율
      };
    });

    // 우선순위 정렬
    const sortedGaps = gaps
      .filter(g => g.gap > 0) // 평균보다 낮은 것만
      .sort((a, b) => b.priority - a.priority);

    // 투자 권장사항 생성
    const recommendations = sortedGaps.slice(0, 5).map((gap, index) => {
      let priority = 'low';
      if (index === 0) priority = 'high';
      else if (index <= 2) priority = 'medium';

      const improvementNeeded = gap.average - gap.current;
      const potentialImpact = (gap.importance * 100).toFixed(1);

      return {
        factor: gap.factor,
        priority,
        improvementNeeded,
        potentialImpact,
        currentValue: gap.current,
        targetValue: gap.average
      };
    });

    setAnalysis({
      region,
      gaps: sortedGaps,
      recommendations,
      nationalAvg
    });
  }, [selectedRegion, regionData, modelData]); // 👈 함수가 사용하는 모든 값(props, state)을 의존성으로 추가

  // 2. useEffect의 의존성 배열에 performAnalysis를 추가
  useEffect(() => {
    if (selectedRegion && regionData && modelData) {
      performAnalysis();
    }
  }, [selectedRegion, regionData, modelData, performAnalysis]); // 👈 performAnalysis 추가

  const getBarChartData = () => {
    if (!analysis) return null;

    const top5Gaps = analysis.gaps.slice(0, 7);

    return {
      labels: top5Gaps.map(g => getFactorDisplayName(g.factor)),
      datasets: [
        {
          label: '현재 값',
          data: top5Gaps.map(g => normalizeValue(g.current, g.factor)),
          backgroundColor: 'rgba(231, 76, 60, 0.7)',
          borderColor: 'rgba(231, 76, 60, 1)',
          borderWidth: 2
        },
        {
          label: '전국 평균',
          data: top5Gaps.map(g => normalizeValue(g.average, g.factor)),
          backgroundColor: 'rgba(52, 152, 219, 0.7)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2
        }
      ]
    };
  };

  const normalizeValue = (value, factor) => {
    if (factor === 'support_program_participants') return Math.min(value / 30, 10);
    if (factor === 'young_farmers_2023') return Math.min(value / 150, 10);
    if (factor === 'average_income') return Math.min(value / 700, 10);
    return value;
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '투자 우선순위 분석 (정규화 점수)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  };

  return (
    <Container>
      <Title>💰 투자 우선순위 분석기</Title>
      <Description>
        지역을 선택하면 전국 평균 대비 부족한 요인을 분석하고, 
        투자 효과가 높은 요인을 우선순위별로 제시합니다.
      </Description>

      <RegionSelector>
        <Label>지역 선택</Label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Select
            value={selectedRegion.split('-')[0] || ''}
            onChange={(e) => {
              const sido = e.target.value;
              if (sido) {
                setSelectedRegion(sido + (selectedRegion.includes('-') ? selectedRegion.substring(selectedRegion.indexOf('-')) : ''));
              } else {
                setSelectedRegion('');
              }
            }}
            $hasValue={!!selectedRegion}
            style={{ flex: 1 }}
          >
            <option value="">-- 시/도 선택 --</option>
            {regionData && [...new Set(regionData.map(region => region.region_name_sido))]
              .sort((a, b) => a.localeCompare(b))
              .map((sido, index) => (
                <option key={`sido-${index}`} value={sido}>
                  {sido}
                </option>
              ))}
          </Select>
          
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            $hasValue={!!selectedRegion}
            disabled={!selectedRegion.includes('-') && !selectedRegion}
            style={{ flex: 2 }}
          >
            <option value="">-- 시/군/구 선택 --</option>
            {regionData && selectedRegion.split('-')[0] && regionData
              .filter(region => region.region_name_sido === selectedRegion.split('-')[0])
              .sort((a, b) => a.region_name_sigungu.localeCompare(b.region_name_sigungu))
              .map((region, index) => (
                <option 
                  key={`sigungu-${index}`}
                  value={`${region.region_name_sido}-${region.region_name_sigungu}`}
                >
                  {region.region_name_sigungu} (정착률: {region.settlement_rate?.toFixed(1)}%)
                </option>
              ))}
          </Select>
        </div>
      </RegionSelector>

      {analysis && (
        <>
          <AnalysisGrid>
            <ChartContainer>
              {getBarChartData() && (
                <Bar data={getBarChartData()} options={barOptions} />
              )}
            </ChartContainer>

            <RecommendationsPanel>
              <SectionTitle>🎯 투자 권장사항</SectionTitle>
              <RecommendationList>
                {analysis.recommendations.map((rec, index) => (
                  <RecommendationCard key={index} $priority={rec.priority}>
                    <div>
                      <PriorityBadge $priority={rec.priority}>
                        {rec.priority === 'high' ? '최우선' : rec.priority === 'medium' ? '우선' : '권장'}
                      </PriorityBadge>
                      <RecommendationTitle>
                        {getFactorDisplayName(rec.factor)}
                      </RecommendationTitle>
                    </div>
                    <RecommendationText>
                      {getRecommendationText(rec.factor, rec.improvementNeeded)}
                    </RecommendationText>
                    <ImpactMetrics>
                      <Metric>
                        <MetricLabel>예상 영향도:</MetricLabel>
                        <MetricValue>{rec.potentialImpact}%</MetricValue>
                      </Metric>
                      <Metric>
                        <MetricLabel>목표 개선:</MetricLabel>
                        <MetricValue>
                          {formatValue(rec.currentValue, rec.factor)} → {formatValue(rec.targetValue, rec.factor)}
                        </MetricValue>
                      </Metric>
                    </ImpactMetrics>
                  </RecommendationCard>
                ))}
              </RecommendationList>
            </RecommendationsPanel>
          </AnalysisGrid>

          <GapAnalysisContainer>
            <GapTitle>📊 전국 평균 대비 갭 분석</GapTitle>
            <GapList>
              {analysis.gaps.slice(0, 7).map((gap, index) => (
                <GapItem key={index}>
                  <GapName>{getFactorDisplayName(gap.factor)}</GapName>
                  <GapValue>
                    {gap.gapPercent > 0 ? '-' : '+'}{Math.abs(gap.gapPercent).toFixed(1)}%
                  </GapValue>
                </GapItem>
              ))}
            </GapList>
          </GapAnalysisContainer>
        </>
      )}
    </Container>
  );
}

function getFactorDisplayName(factor) {
  const displayNames = {
    'support_program_participants': '지원 프로그램 참여자',
    'young_farmers_2023': '청년농업인 수',
    'policy_satisfaction': '정책 만족도',
    'average_income': '평균 소득',
    'land_availability_score': '토지 가용성',
    'agricultural_technology_score': '농업 기술',
    'community_support_score': '커뮤니티 지원'
  };
  return displayNames[factor] || factor;
}

function formatValue(value, factor) {
  if (factor === 'support_program_participants' || factor === 'young_farmers_2023') {
    return `${Math.round(value)}명`;
  }
  if (factor === 'average_income') {
    return `${Math.round(value)}만원`;
  }
  return value.toFixed(1);
}

function getRecommendationText(factor, improvement) {
  const texts = {
    'support_program_participants': `지원 프로그램 참여자를 약 ${Math.round(improvement)}명 늘리면 정착률 향상이 예상됩니다. 프로그램 홍보 강화 및 접근성 개선이 필요합니다.`,
    'young_farmers_2023': `기존 청년농업인 네트워크 확대가 필요합니다. 약 ${Math.round(improvement)}명의 청년농업인 유입을 목표로 해야 합니다.`,
    'policy_satisfaction': `정책 만족도를 ${improvement.toFixed(1)}점 높이기 위해 정책 수혜자 피드백 수렴 및 실질적 지원 확대가 필요합니다.`,
    'average_income': `소득 증대를 위한 판로 확보, 가공 시설 지원 등이 필요합니다. 약 ${Math.round(improvement)}만원의 소득 향상 목표 설정이 권장됩니다.`,
    'land_availability_score': `농지 확보 지원 프로그램 강화 및 임대 농지 정보 제공 시스템 구축이 필요합니다.`,
    'agricultural_technology_score': `스마트팜 기술 교육, 최신 농업 기술 보급, 전문가 멘토링 프로그램 확대가 효과적입니다.`,
    'community_support_score': `청년농업인 커뮤니티 활성화, 정기 모임 지원, 선배 농업인 네트워킹 프로그램이 필요합니다.`
  };
  return texts[factor] || '해당 요인에 대한 투자가 권장됩니다.';
}

export default InvestmentAnalyzer;