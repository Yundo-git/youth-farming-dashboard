import React from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin: 0 0 30px 0;
  width: 100%;
  box-sizing: border-box;
`;

const ChartTitle = styled.h3`
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 30px 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding-bottom: 15px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 4px;
    border-radius: 2px;
  }
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  
  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const ChartFigure = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 350px;
  margin: 0 auto;
  flex: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 992px) {
    padding-right: 30px;
    height: 400px;
  }
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 4;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.color};
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }
`;

const LegendIndex = styled.span`
  background: ${props => props.color};
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 15px;
  flex-shrink: 0;
`;

const LegendContent = styled.div`
  flex: 1;
`;

const LegendTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const LegendPercentage = styled.div`
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
`;

const SettlementFactorsChart = () => {
  // 정착률에 영향을 미치는 핵심 요인 데이터
  const factorsData = {
    labels: [
      '지원 프로그램 참여자 수',
      '기존 청년농업인 수',
      '정책 만족도',
      '평균 소득',
      '토지 가용성'
    ],
    datasets: [
      {
        data: [27.2, 20.5, 18.9, 15.2, 8.9],
        backgroundColor: [
          '#4e73df',  // Blue
          '#1cc88a',  // Green
          '#f6c23e',  // Yellow
          '#e74a3b',  // Red
          '#858796'   // Gray
        ],
        borderWidth: 0,
        hoverOffset: 15,
        borderRadius: 8,
        spacing: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    onHover: (event, elements) => {
      const canvas = event.native.target;
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>🎯 정착률에 영향을 미치는 핵심 요인 (중요도 순위)</ChartTitle>
      <ChartWrapper>
        <ChartFigure>
          <Doughnut data={factorsData} options={chartOptions} />
        </ChartFigure>
        
        <LegendContainer>
          {factorsData.labels.map((label, index) => (
            <LegendItem 
              key={index} 
              color={factorsData.datasets[0].backgroundColor[index]}
              data-tooltip={`${label}: ${factorsData.datasets[0].data[index]}%`}
            >
              <LegendIndex color={factorsData.datasets[0].backgroundColor[index]}>
                {index + 1}
              </LegendIndex>
              <LegendContent>
                <LegendTitle>{label}</LegendTitle>
                <LegendPercentage>중요도: {factorsData.datasets[0].data[index]}%</LegendPercentage>
              </LegendContent>
            </LegendItem>
          ))}
        </LegendContainer>
      </ChartWrapper>
    </ChartContainer>
  );
};

export default SettlementFactorsChart;
