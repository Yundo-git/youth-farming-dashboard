// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { Radar } from 'react-chartjs-2';
// import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// const Container = styled.div`
//   background: white;
//   border-radius: 12px;
//   padding: 32px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// `;

// const Title = styled.h2`
//   margin: 0 0 12px 0;
//   font-size: 28px;
//   color: #2c3e50;
//   display: flex;
//   align-items: center;
//   gap: 12px;
// `;

// const Description = styled.p`
//   color: #7f8c8d;
//   font-size: 16px;
//   margin-bottom: 32px;
//   line-height: 1.6;
// `;

// const RegionSelector = styled.div`
//   margin-bottom: 32px;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 12px;
//   font-weight: 600;
//   color: #34495e;
//   font-size: 18px;
// `;

// const Select = styled.select`
//   width: 100%;
//   max-width: 500px;
//   padding: 14px 18px;
//   font-size: 16px;
//   border: 2px solid ${props => props.$hasValue ? '#3498db' : '#e0e0e0'};
//   border-radius: 10px;
//   background: white;
//   cursor: pointer;
//   transition: all 0.3s;

//   &:hover {
//     border-color: #3498db;
//   }

//   &:focus {
//     outline: none;
//     border-color: #2980b9;
//     box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
//   }
// `;

// const ComparisonContainer = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 32px;
//   margin-bottom: 32px;

//   @media (max-width: 1024px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Panel = styled.div`
//   background: ${props => props.$bgColor || '#f8f9fa'};
//   border-radius: 12px;
//   padding: 24px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
// `;

// const PanelTitle = styled.h3`
//   margin: 0 0 20px 0;
//   font-size: 20px;
//   color: #2c3e50;
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// const CurrentRate = styled.div`
//   text-align: center;
//   padding: 20px;
//   background: white;
//   border-radius: 12px;
//   margin-bottom: 20px;
// `;

// const RateLabel = styled.div`
//   font-size: 14px;
//   color: #7f8c8d;
//   margin-bottom: 8px;
// `;

// const RateValue = styled.div`
//   font-size: 42px;
//   font-weight: bold;
//   color: ${props => props.$color || '#27ae60'};
// `;

// const FactorSliders = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `;

// const SliderGroup = styled.div`
//   background: white;
//   padding: 16px;
//   border-radius: 10px;
// `;

// const SliderLabel = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 12px;
// `;

// const SliderName = styled.span`
//   font-size: 15px;
//   font-weight: 600;
//   color: #2c3e50;
// `;

// const SliderValue = styled.span`
//   font-size: 15px;
//   font-weight: bold;
//   color: #3498db;
//   background: #e3f2fd;
//   padding: 4px 12px;
//   border-radius: 6px;
// `;

// const Slider = styled.input`
//   width: 100%;
//   height: 8px;
//   border-radius: 5px;
//   background: linear-gradient(
//     to right,
//     #3498db 0%,
//     #3498db ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%,
//     #e0e0e0 ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%,
//     #e0e0e0 100%
//   );
//   outline: none;
//   -webkit-appearance: none;
//   appearance: none;

//   &::-webkit-slider-thumb {
//     -webkit-appearance: none;
//     appearance: none;
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background: #3498db;
//     cursor: pointer;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//   }

//   &::-moz-range-thumb {
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background: #3498db;
//     cursor: pointer;
//     border: none;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//   }
// `;

// const PredictionResult = styled.div`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
//   padding: 24px;
//   border-radius: 12px;
//   text-align: center;
// `;

// const PredictionLabel = styled.div`
//   font-size: 16px;
//   margin-bottom: 8px;
//   opacity: 0.9;
// `;

// const PredictionValue = styled.div`
//   font-size: 48px;
//   font-weight: bold;
//   margin-bottom: 12px;
// `;

// const PredictionChange = styled.div`
//   font-size: 20px;
//   font-weight: 600;
//   color: ${props => props.$positive ? '#4caf50' : '#f44336'};
//   background: white;
//   display: inline-block;
//   padding: 8px 16px;
//   border-radius: 8px;
// `;

// const ChartContainer = styled.div`
//   height: 350px;
//   margin-top: 24px;
// `;

// const ResetButton = styled.button`
//   width: 100%;
//   padding: 12px;
//   background: #e74c3c;
//   color: white;
//   border: none;
//   border-radius: 8px;
//   font-size: 16px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s;
//   margin-top: 16px;

//   &:hover {
//     background: #c0392b;
//     transform: translateY(-2px);
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//   }
// `;

// const BenchmarkInfo = styled.div`
//   background: #fff9e6;
//   border: 2px solid #f39c12;
//   border-radius: 8px;
//   padding: 16px;
//   margin-top: 16px;
// `;

// const BenchmarkTitle = styled.div`
//   font-weight: 600;
//   color: #e67e22;
//   margin-bottom: 8px;
//   font-size: 15px;
// `;

// const BenchmarkText = styled.div`
//   font-size: 14px;
//   color: #5a6c7d;
//   line-height: 1.5;
// `;

// function PolicySimulator({ regionData, modelData }) {
//   const [selectedRegion, setSelectedRegion] = useState('');
//   const [currentFactors, setCurrentFactors] = useState({});
//   const [adjustedFactors, setAdjustedFactors] = useState({});
//   const [predictedRate, setPredictedRate] = useState(null);

//   useEffect(() => {
//     if (selectedRegion && regionData) {
//       const region = regionData.find(r => 
//         `${r.region_name_sido}-${r.region_name_sigungu}` === selectedRegion
//       );
      
//       if (region) {
//         const factors = {
//           support_program_participants: region.support_program_participants || 0,
//           young_farmers_2023: region.young_farmers_2023 || 0,
//           policy_satisfaction: region.policy_satisfaction || 0,
//           average_income: region.average_income || 0,
//           land_availability_score: region.land_availability_score || 0,
//           agricultural_technology_score: region.agricultural_technology_score || 0,
//           community_support_score: region.community_support_score || 0
//         };
        
//         setCurrentFactors(factors);
//         setAdjustedFactors(factors);
//       }
//     }
//   }, [selectedRegion, regionData]);

//   useEffect(() => {
//     if (Object.keys(adjustedFactors).length > 0 && modelData) {
//       calculatePrediction();
//     }
//   }, [adjustedFactors]);

//   const calculatePrediction = () => {
//     if (!modelData || !modelData.feature_importance) return;

//     const baseRate = getCurrentSettlementRate();
//     let prediction = baseRate;

//     // 각 요인의 변화량에 중요도를 곱하여 예측
//     Object.entries(adjustedFactors).forEach(([factor, value]) => {
//       const currentValue = currentFactors[factor] || 0;
//       const importance = modelData.feature_importance[factor] || 0;
      
//       // 정규화된 변화율 계산
//       let changeRate = 0;
//       if (currentValue > 0) {
//         changeRate = ((value - currentValue) / currentValue) * 100;
//       } else if (value > 0) {
//         changeRate = 100;
//       }
      
//       // 변화율에 중요도를 곱하여 정착률 변화 추정
//       const impact = (changeRate * importance) * 0.15; // 조정 계수
//       prediction += impact;
//     });

//     // 정착률은 0-100% 범위로 제한
//     prediction = Math.max(0, Math.min(100, prediction));
//     setPredictedRate(prediction);
//   };

//   const getCurrentSettlementRate = () => {
//     const region = regionData.find(r => 
//       `${r.region_name_sido}-${r.region_name_sigungu}` === selectedRegion
//     );
//     return region ? region.settlement_rate : 0;
//   };

//   const handleFactorChange = (factor, value) => {
//     setAdjustedFactors(prev => ({
//       ...prev,
//       [factor]: parseFloat(value)
//     }));
//   };

//   const handleReset = () => {
//     setAdjustedFactors({...currentFactors});
//   };

//   const getRegionalAverage = () => {
//     if (!selectedRegion || !regionData) return null;

//     const region = regionData.find(r => 
//       `${r.region_name_sido}-${r.region_name_sigungu}` === selectedRegion
//     );
    
//     if (!region) return null;

//     // 같은 시도 내 다른 지역들의 평균
//     const sameProvinceRegions = regionData.filter(r => 
//       r.region_name_sido === region.region_name_sido
//     );

//     const avg = {
//       support_program_participants: 0,
//       young_farmers_2023: 0,
//       policy_satisfaction: 0,
//       average_income: 0,
//       land_availability_score: 0,
//       agricultural_technology_score: 0,
//       community_support_score: 0
//     };

//     Object.keys(avg).forEach(key => {
//       avg[key] = sameProvinceRegions.reduce((sum, r) => sum + (r[key] || 0), 0) / sameProvinceRegions.length;
//     });

//     return avg;
//   };

//   const getRadarChartData = () => {
//     if (!currentFactors || Object.keys(currentFactors).length === 0) {
//       return null;
//     }

//     const labels = [
//       '지원 프로그램',
//       '청년농업인 수',
//       '정책 만족도',
//       '평균 소득',
//       '토지 가용성',
//       '농업 기술',
//       '커뮤니티'
//     ];

//     // 정규화 (0-10 스케일)
//     const normalize = (value, factor) => {
//       if (factor === 'support_program_participants') return Math.min(value / 30, 10);
//       if (factor === 'young_farmers_2023') return Math.min(value / 150, 10);
//       if (factor === 'average_income') return Math.min(value / 700, 10);
//       return value; // 나머지는 이미 10점 만점
//     };

//     const currentValues = [
//       normalize(currentFactors.support_program_participants, 'support_program_participants'),
//       normalize(currentFactors.young_farmers_2023, 'young_farmers_2023'),
//       currentFactors.policy_satisfaction,
//       normalize(currentFactors.average_income, 'average_income'),
//       currentFactors.land_availability_score,
//       currentFactors.agricultural_technology_score,
//       currentFactors.community_support_score
//     ];

//     const adjustedValues = [
//       normalize(adjustedFactors.support_program_participants, 'support_program_participants'),
//       normalize(adjustedFactors.young_farmers_2023, 'young_farmers_2023'),
//       adjustedFactors.policy_satisfaction,
//       normalize(adjustedFactors.average_income, 'average_income'),
//       adjustedFactors.land_availability_score,
//       adjustedFactors.agricultural_technology_score,
//       adjustedFactors.community_support_score
//     ];

//     return {
//       labels,
//       datasets: [
//         {
//           label: '현재 상태',
//           data: currentValues,
//           backgroundColor: 'rgba(231, 76, 60, 0.2)',
//           borderColor: 'rgba(231, 76, 60, 1)',
//           borderWidth: 2,
//           pointBackgroundColor: 'rgba(231, 76, 60, 1)',
//           pointBorderColor: '#fff',
//           pointHoverBackgroundColor: '#fff',
//           pointHoverBorderColor: 'rgba(231, 76, 60, 1)'
//         },
//         {
//           label: '개선 후',
//           data: adjustedValues,
//           backgroundColor: 'rgba(52, 152, 219, 0.2)',
//           borderColor: 'rgba(52, 152, 219, 1)',
//           borderWidth: 2,
//           pointBackgroundColor: 'rgba(52, 152, 219, 1)',
//           pointBorderColor: '#fff',
//           pointHoverBackgroundColor: '#fff',
//           pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
//         }
//       ]
//     };
//   };

//   const radarOptions = {
//     scales: {
//       r: {
//         beginAtZero: true,
//         max: 10,
//         ticks: {
//           stepSize: 2
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//       }
//     },
//     maintainAspectRatio: false
//   };

//   const currentRate = getCurrentSettlementRate();
//   const rateChange = predictedRate ? (predictedRate - currentRate).toFixed(1) : 0;
//   const regionalAvg = getRegionalAverage();

//   return (
//     <Container>
//       <Title>🎛️ 정책 투자 시뮬레이터</Title>
//       <Description>
//         지역을 선택하고 투자하고 싶은 요인의 수치를 조정해보세요. 
//         예상 정착률 변화를 실시간으로 확인할 수 있습니다.
//       </Description>

//       <RegionSelector>
//         <Label>지역 선택</Label>
//         <Select
//           value={selectedRegion}
//           onChange={(e) => setSelectedRegion(e.target.value)}
//           $hasValue={!!selectedRegion}
//         >
//           <option value="">-- 지역을 선택하세요 --</option>
//           {regionData && regionData
//             .sort((a, b) => (b.settlement_rate || 0) - (a.settlement_rate || 0))
//             .map((region, index) => (
//               <option 
//                 key={index}
//                 value={`${region.region_name_sido}-${region.region_name_sigungu}`}
//               >
//                 {region.region_name_sido} {region.region_name_sigungu} (현재 정착률: {region.settlement_rate?.toFixed(1)}%)
//               </option>
//             ))}
//         </Select>
//       </RegionSelector>

//       {selectedRegion && (
//         <>
//           <ComparisonContainer>
//             <Panel $bgColor="#fff5f5">
//               <PanelTitle>📍 현재 상태</PanelTitle>
//               <CurrentRate>
//                 <RateLabel>현재 정착률</RateLabel>
//                 <RateValue $color="#e74c3c">{currentRate?.toFixed(1)}%</RateValue>
//               </CurrentRate>

//               {regionalAvg && (
//                 <BenchmarkInfo>
//                   <BenchmarkTitle>🔍 지역 평균 대비</BenchmarkTitle>
//                   <BenchmarkText>
//                     {Object.entries(currentFactors).map(([key, value]) => {
//                       const avgValue = regionalAvg[key];
//                       const diff = value - avgValue;
//                       const diffPercent = avgValue > 0 ? ((diff / avgValue) * 100).toFixed(1) : 0;
//                       return diff < -5 ? (
//                         <div key={key}>
//                           • {getFactorDisplayName(key)}: 평균보다 {Math.abs(diffPercent)}% 낮음
//                         </div>
//                       ) : null;
//                     })}
//                   </BenchmarkText>
//                 </BenchmarkInfo>
//               )}
//             </Panel>

//             <Panel $bgColor="#f0f9ff">
//               <PanelTitle>🚀 개선 시나리오</PanelTitle>
              
//               <FactorSliders>
//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>지원 프로그램 참여자 수</SliderName>
//                     <SliderValue>{adjustedFactors.support_program_participants?.toFixed(0)}명</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={0}
//                     max={500}
//                     step={10}
//                     value={adjustedFactors.support_program_participants || 0}
//                     onChange={(e) => handleFactorChange('support_program_participants', e.target.value)}
//                   />
//                 </SliderGroup>

//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>기존 청년농업인 수</SliderName>
//                     <SliderValue>{adjustedFactors.young_farmers_2023?.toFixed(0)}명</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={0}
//                     max={2000}
//                     step={50}
//                     value={adjustedFactors.young_farmers_2023 || 0}
//                     onChange={(e) => handleFactorChange('young_farmers_2023', e.target.value)}
//                   />
//                 </SliderGroup>

//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>정책 만족도</SliderName>
//                     <SliderValue>{adjustedFactors.policy_satisfaction?.toFixed(1)}</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={0}
//                     max={10}
//                     step={0.5}
//                     value={adjustedFactors.policy_satisfaction || 0}
//                     onChange={(e) => handleFactorChange('policy_satisfaction', e.target.value)}
//                   />
//                 </SliderGroup>

//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>평균 소득 (만원)</SliderName>
//                     <SliderValue>{adjustedFactors.average_income?.toFixed(0)}만원</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={2000}
//                     max={8000}
//                     step={100}
//                     value={adjustedFactors.average_income || 0}
//                     onChange={(e) => handleFactorChange('average_income', e.target.value)}
//                   />
//                 </SliderGroup>

//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>토지 가용성 점수</SliderName>
//                     <SliderValue>{adjustedFactors.land_availability_score?.toFixed(1)}</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={0}
//                     max={10}
//                     step={0.5}
//                     value={adjustedFactors.land_availability_score || 0}
//                     onChange={(e) => handleFactorChange('land_availability_score', e.target.value)}
//                   />
//                 </SliderGroup>

//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>농업 기술 수준</SliderName>
//                     <SliderValue>{adjustedFactors.agricultural_technology_score?.toFixed(1)}</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={0}
//                     max={10}
//                     step={0.5}
//                     value={adjustedFactors.agricultural_technology_score || 0}
//                     onChange={(e) => handleFactorChange('agricultural_technology_score', e.target.value)}
//                   />
//                 </SliderGroup>

//                 <SliderGroup>
//                   <SliderLabel>
//                     <SliderName>커뮤니티 지원</SliderName>
//                     <SliderValue>{adjustedFactors.community_support_score?.toFixed(1)}</SliderValue>
//                   </SliderLabel>
//                   <Slider
//                     type="range"
//                     min={0}
//                     max={10}
//                     step={0.5}
//                     value={adjustedFactors.community_support_score || 0}
//                     onChange={(e) => handleFactorChange('community_support_score', e.target.value)}
//                   />
//                 </SliderGroup>
//               </FactorSliders>

//               <ResetButton onClick={handleReset}>
//                 🔄 초기화
//               </ResetButton>
//             </Panel>
//           </ComparisonContainer>

//           {predictedRate !== null && (
//             <PredictionResult>
//               <PredictionLabel>예상 정착률</PredictionLabel>
//               <PredictionValue>{predictedRate.toFixed(1)}%</PredictionValue>
//               <PredictionChange $positive={rateChange >= 0}>
//                 {rateChange >= 0 ? '▲' : '▼'} {Math.abs(rateChange)}%p
//               </PredictionChange>
//             </PredictionResult>
//           )}

//           {getRadarChartData() && (
//             <ChartContainer>
//               <Radar data={getRadarChartData()} options={radarOptions} />
//             </ChartContainer>
//           )}
//         </>
//       )}
//     </Container>
//   );
// }

// function getFactorDisplayName(factor) {
//   const displayNames = {
//     'support_program_participants': '지원 프로그램 참여자',
//     'young_farmers_2023': '청년농업인 수',
//     'policy_satisfaction': '정책 만족도',
//     'average_income': '평균 소득',
//     'land_availability_score': '토지 가용성',
//     'agricultural_technology_score': '농업 기술',
//     'community_support_score': '커뮤니티 지원'
//   };
//   return displayNames[factor] || factor;
// }

// export default PolicySimulator;
