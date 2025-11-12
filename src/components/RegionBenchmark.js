import React, { useState, useEffect, useCallback } from 'react'; // 👈 useCallback import 추가
import styled from 'styled-components';

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

const BenchmarkResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ResultCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid ${props => props.$rank === 1 ? '#f39c12' : props.$rank === 2 ? '#95a5a6' : '#3498db'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const RegionName = styled.h3`
  margin: 0;
  font-size: 22px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RankBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$rank === 1 ? '#f39c12' : props.$rank === 2 ? '#95a5a6' : '#3498db'};
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const SettlementRate = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #27ae60;
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #7f8c8d;
  font-weight: 600;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const InfoLabel = styled.span`
  color: #5a6c7d;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const SimilarityScore = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
`;

const SimilarityLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const SimilarityValue = styled.div`
  font-size: 28px;
  font-weight: bold;
`;

const SuccessFactors = styled.div`
  background: #e8f5e9;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
`;

const FactorsTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #2e7d32;
  font-weight: 600;
`;

const FactorsList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const FactorItem = styled.li`
  color: #5a6c7d;
  font-size: 14px;
  line-height: 1.8;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #95a5a6;
  font-size: 18px;
`;

const FilterInfo = styled.div`
  background: #fff3e0;
  border: 2px solid #f39c12;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const FilterTitle = styled.div`
  font-weight: 600;
  color: #e67e22;
  margin-bottom: 8px;
  font-size: 16px;
`;

const FilterText = styled.div`
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.6;
`;

function RegionBenchmark({ regionData }) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [benchmarkResults, setBenchmarkResults] = useState([]);

  // 유사도 계산 함수들은 props/state에 의존하지 않으므로 그대로 유지
  const calculateProximityMatch = (grade1, grade2) => {
    const grades = ['A', 'B', 'C', 'D'];
    const diff = Math.abs(grades.indexOf(grade1) - grades.indexOf(grade2));
    
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.7;
    if (diff === 2) return 0.4;
    return 0.2;
  };

  const calculateInfrastructureMatch = (score1, score2) => {
    const diff = Math.abs(score1 - score2);
    const maxDiff = 10; // 최대 점수 차이
    
    return Math.max(0, 1 - (diff / maxDiff));
  };

  const calculateScaleMatch = (count1, count2) => {
    if (count1 === 0 || count2 === 0) return 0.5;
    
    const ratio = Math.min(count1, count2) / Math.max(count1, count2);
    return ratio;
  };

  const analyzeSuccessFactors = (target, benchmark) => {
    const factors = [];

    // 지원 프로그램
    if ((benchmark.support_program_participants || 0) > (target.support_program_participants || 0) * 1.2) {
      factors.push(`지원 프로그램 참여자 수가 ${Math.round((benchmark.support_program_participants || 0) - (target.support_program_participants || 0))}명 더 많음`);
    }

    // 정책 만족도
    if ((benchmark.policy_satisfaction || 0) > (target.policy_satisfaction || 0) + 0.5) {
      factors.push(`정책 만족도가 ${((benchmark.policy_satisfaction || 0) - (target.policy_satisfaction || 0)).toFixed(1)}점 더 높음`);
    }

    // 평균 소득
    if ((benchmark.average_income || 0) > (target.average_income || 0) * 1.1) {
      factors.push(`평균 소득이 ${Math.round((benchmark.average_income || 0) - (target.average_income || 0))}만원 더 높음`);
    }

    // 농업 기술
    if ((benchmark.agricultural_technology_score || 0) > (target.agricultural_technology_score || 0) + 1) {
      factors.push(`농업 기술 수준이 ${((benchmark.agricultural_technology_score || 0) - (target.agricultural_technology_score || 0)).toFixed(1)}점 더 높음`);
    }

    // 커뮤니티 지원
    if ((benchmark.community_support_score || 0) > (target.community_support_score || 0) + 1) {
      factors.push(`커뮤니티 지원 점수가 ${((benchmark.community_support_score || 0) - (target.community_support_score || 0)).toFixed(1)}점 더 높음`);
    }

    return factors.length > 0 ? factors : ['전반적으로 균형잡힌 발전을 이룸'];
  };

  // findSimilarRegions 함수를 useCallback으로 래핑
  const findSimilarRegions = useCallback(() => {
    const targetRegion = regionData.find(r => 
      `${r.region_name_sido}-${r.region_name_sigungu}` === selectedRegion
    );

    if (!targetRegion) return;

    // 유사 지역 찾기 기준
    // 1. 대도시 근접성 등급이 같거나 유사
    // 2. 인프라 점수가 비슷
    // 3. 정착률이 높은 지역 우선

    const similarRegions = regionData
      .filter(r => {
        // 자기 자신 제외
        if (r.region_name_sigungu === targetRegion.region_name_sigungu &&
            r.region_name_sido === targetRegion.region_name_sido) {
          return false;
        }

        // 정착률이 목표 지역보다 높은 곳만
        return (r.settlement_rate || 0) > (targetRegion.settlement_rate || 0);
      })
      .map(r => {
        // 유사도 계산
        const proximityMatch = calculateProximityMatch(
          targetRegion.proximity_grade,
          r.proximity_grade
        );

        const infrastructureMatch = calculateInfrastructureMatch(
          targetRegion.infrastructure_score || 0,
          r.infrastructure_score || 0
        );

        // 규모 유사도 (청년농업인 수 기준)
        const scaleMatch = calculateScaleMatch(
          targetRegion.young_farmers_2023 || 0,
          r.young_farmers_2023 || 0
        );

        // 종합 유사도 (가중 평균)
        const similarityScore = (
          proximityMatch * 0.35 +
          infrastructureMatch * 0.40 +
          scaleMatch * 0.25
        );

        return {
          ...r,
          similarityScore
        };
      })
      .filter(r => r.similarityScore > 0.5) // 유사도 50% 이상만
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5); // 상위 5개

    // 성공 요인 분석
    const enrichedResults = similarRegions.map((r, index) => ({
      ...r,
      rank: index + 1,
      successFactors: analyzeSuccessFactors(targetRegion, r)
    }));

    setBenchmarkResults(enrichedResults);
  }, [selectedRegion, regionData]); // 👈 의존성 배열에 selectedRegion과 regionData 추가

  // useEffect에 findSimilarRegions를 의존성으로 추가
  useEffect(() => {
    if (selectedRegion && regionData) {
      findSimilarRegions(); // 👈 useCallback으로 감싼 함수 호출
    }
  }, [selectedRegion, regionData, findSimilarRegions]); // 👈 findSimilarRegions 추가

  const targetRegion = regionData?.find(r => 
    `${r.region_name_sido}-${r.region_name_sigungu}` === selectedRegion
  );

  return (
    <Container>
      <Title>🎯 유사 지역 벤치마킹</Title>
      <Description>
        인프라, 대도시 근접성, 규모가 유사하면서 정착률이 높은 지역을 찾아 
        성공 요인을 분석하고 벤치마킹 대상으로 추천합니다.
      </Description>

      <RegionSelector>
        <Label>우리 지역 선택</Label>
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

      {selectedRegion && targetRegion && (
        <FilterInfo>
          <FilterTitle>📋 현재 지역 정보</FilterTitle>
          <FilterText>
            <strong>{targetRegion.region_name_sido} {targetRegion.region_name_sigungu}</strong><br/>
            • 현재 정착률: {targetRegion.settlement_rate?.toFixed(1)}%<br/>
            • 대도시 근접성: {targetRegion.proximity_grade}등급 ({targetRegion.nearest_major_city}와 {targetRegion.proximity_to_city?.toFixed(1)}km)<br/>
            • 인프라 종합 점수: {targetRegion.infrastructure_score?.toFixed(1)}점<br/>
            • 청년농업인 수: {targetRegion.young_farmers_2023}명
          </FilterText>
        </FilterInfo>
      )}

      <BenchmarkResults>
        {benchmarkResults.length > 0 ? (
          benchmarkResults.map((region) => (
            <ResultCard key={region.region_name_sigungu} $rank={region.rank}>
              <CardHeader>
                <RegionName>
                  <RankBadge $rank={region.rank}>{region.rank}</RankBadge>
                  {region.region_name_sido} {region.region_name_sigungu}
                </RegionName>
                <SettlementRate>{region.settlement_rate?.toFixed(1)}%</SettlementRate>
              </CardHeader>

              <CardBody>
                <InfoSection>
                  <SectionTitle>기본 정보</SectionTitle>
                  <InfoList>
                    <InfoItem>
                      <InfoLabel>청년농업인</InfoLabel>
                      <InfoValue>{region.young_farmers_2023}명</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>지원 프로그램 참여</InfoLabel>
                      <InfoValue>{region.support_program_participants}명</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>정책 만족도</InfoLabel>
                      <InfoValue>{region.policy_satisfaction?.toFixed(1)}점</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>평균 소득</InfoLabel>
                      <InfoValue>{region.average_income}만원</InfoValue>
                    </InfoItem>
                  </InfoList>
                </InfoSection>

                <InfoSection>
                  <SectionTitle>인프라 점수</SectionTitle>
                  <InfoList>
                    <InfoItem>
                      <InfoLabel>토지 가용성</InfoLabel>
                      <InfoValue>{region.land_availability_score?.toFixed(1)}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>농업 기술</InfoLabel>
                      <InfoValue>{region.agricultural_technology_score?.toFixed(1)}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>커뮤니티 지원</InfoLabel>
                      <InfoValue>{region.community_support_score?.toFixed(1)}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>대도시 근접성</InfoLabel>
                      <InfoValue>
                        {region.proximity_grade}등급 ({region.proximity_to_city?.toFixed(0)}km)
                      </InfoValue>
                    </InfoItem>
                  </InfoList>
                </InfoSection>
              </CardBody>

              <SimilarityScore>
                <SimilarityLabel>우리 지역과의 유사도</SimilarityLabel>
                <SimilarityValue>{(region.similarityScore * 100).toFixed(0)}%</SimilarityValue>
              </SimilarityScore>

              <SuccessFactors>
                <FactorsTitle>💡 이 지역의 성공 요인</FactorsTitle>
                <FactorsList>
                  {region.successFactors.map((factor, index) => (
                    <FactorItem key={index}>{factor}</FactorItem>
                  ))}
                </FactorsList>
              </SuccessFactors>
            </ResultCard>
          ))
        ) : selectedRegion ? (
          <NoResults>
            유사한 조건의 벤치마킹 대상 지역을 찾지 못했습니다.<br/>
            다른 지역을 선택해보세요.
          </NoResults>
        ) : null}
      </BenchmarkResults>
    </Container>
  );
}

export default RegionBenchmark;