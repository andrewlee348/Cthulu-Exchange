// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useState, useEffect, useRef } from "react";
import { IoCheckmarkCircle, IoMdAddCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import ActionButton from "../../../../components/card/ActionButton";
import SellButton from "components/card/SellButton";
import BuyButton from "components/card/BuyButton";
import ConvertButton from "components/card/ConvertButton";
import DepositButton from "components/card/DepositButton";
import WithdrawButton from "components/card/WithdrawButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

const lineChartDataTotalSpent = [
  {
    name: "Revenue",
    data: [55000, 64, 48, 66, 49, 68, 50],
  },
];

const testOptions = {
  chart: {
    type: "area",
    stacked: false,
    zoom: {
      type: "x",
      enabled: false,
      autoScaleYaxis: true,
    },
    toolbar: {
      show: false,
      autoSelected: "zoom",
    },
  },
  dataLabels: {
    enabled: false,
  },

  // annotations: {
  //   yaxis: [
  //     {
  //       y: 30,
  //       borderColor: "#999",
  //       label: {
  //         show: true,
  //         text: "Support",
  //         style: {
  //           color: "#fff",
  //           background: "#00E396",
  //         },
  //       },
  //     },
  //   ],
  //   xaxis: [
  //     {
  //       x: new Date("14 Nov 2012").getTime(),
  //       borderColor: "#999",
  //       yAxisIndex: 0,
  //       label: {
  //         show: true,
  //         text: "Rally",
  //         style: {
  //           color: "#fff",
  //           background: "#8D5DD0",
  //         },
  //       },
  //     },
  //   ],
  // },
  markers: {
    size: 0,
    style: "hollow",
    colors: "#AAAAAA",
  },
  title: {
    text: "",
    align: "left",
  },
  fill: {
    colors: ["#FFAF00"],
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
  stroke: {
    curve: "smooth",
    type: "line",
    colors: ["#FFAF00"],
  },
  yaxis: {
    show: false,
    labels: {
      formatter: function (val) {
        return val.toFixed(0);
        // (val / 1000000).toFixed(0);
      },
    },
    title: {
      text: "",
    },
  },
  xaxis: {
    type: "datetime",
    title: {
      text: "",
    },
    tickPlacement: "on",
    labels: {
      formatter: function (val) {
        const date = new Date(val);
        const minute = date.getMinutes();
        const hour = date.getHours();
        const day = date.getDate();
        const month = date.toLocaleString("en-us", { month: "short" }); // Get short month name (e.g., "Sep")
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      },
    },
    tickAmount: 4,
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    marker: {
      show: false,
    },

    x: {
      show: true,
      format: "dd MMM yyyy",
    },
    shared: true,
    y: {
      title: {
        formatter: function (val) {
          return;
        },
      },
      formatter: function (val) {
        return "$" + val.toFixed(2);
        //  (val / 1000000).toFixed(0)
      },
    },
  },
};

export default function Chart({ coinData, gD, title, ...rest }) {
  const brandColor = useColorModeValue("brand.500", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondarxyGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  const chartRef = useRef(null);
  const [timeSelect, setTimeSelect] = useState("week");
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (gD) {
      setGraphData(gD);
      console.log("Chart GD:", gD);
      //   chartRef.current.updateData(gD[2]);
    }
  }, [gD]);

  const changeTimeSelect = (time) => {
    setTimeSelect(time);
  };

  const changeGraphInterval = (graphInterval) => {
    // graphInterval = "week", "day", ""
    chartRef.current.updateData(graphInterval);
  };

  return graphData ? (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      {...rest}
    >
      <Flex justify="space-between">
        <Flex align="center" w="100%">
          <Flex
            flexDirection="column"
            alignItems="flex-start"
            mt="-10px"
            ml="6px"
            mb="20px"
          >
            <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
              {title}
            </Text>
            <Flex flexDirection="row" justifyContent="flex-start">
              <Text
                color={textColor}
                fontSize="34px"
                textAlign="start"
                fontWeight="700"
                lineHeight="100%"
              >
                {coinData.market_data.current_price["usd"]}
              </Text>
              <Flex align="center">
                <Flex align="center">
                  <Icon as={RiArrowUpSFill} color="green.500" />
                  <Text color="green.500" fontSize="sm" fontWeight="700">
                    +2.45%
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection="column" minW="100%">
          <Box minH="260px" mt="auto">
            <LineChart
              chartData={graphData}
              chartOptions={testOptions}
              ref={chartRef}
            />
          </Box>
          <Flex flexDirection="row" justifyContent="center">
            <Button
              bg={timeSelect === "day" ? "rgb(230,230,230)" : boxBg}
              fontSize="sm"
              fontWeight="500"
              color={textColorSecondary}
              borderRadius="7px"
              onClick={() => {
                changeGraphInterval("day");
                changeTimeSelect("day");
              }}
              width="50px"
              height="35px"
              ml="10px"
              mr="10px"
            >
              24H
            </Button>
            <Button
              bg={timeSelect === "week" ? "rgb(230,230,230)" : boxBg}
              fontSize="sm"
              fontWeight="500"
              color={textColorSecondary}
              borderRadius="7px"
              onClick={() => {
                changeGraphInterval("week");
                changeTimeSelect("week");
              }}
              width="50px"
              height="35px"
              ml="10px"
              mr="10px"
            >
              1W
            </Button>
            <Button
              bg={timeSelect === "month" ? "rgb(230,230,230)" : boxBg}
              fontSize="sm"
              fontWeight="500"
              color={textColorSecondary}
              borderRadius="7px"
              onClick={() => {
                changeGraphInterval("month");
                changeTimeSelect("month");
              }}
              width="50px"
              height="35px"
              ml="10px"
              mr="10px"
            >
              1M
            </Button>
            <Button
              bg={timeSelect === "quarter" ? "rgb(230,230,230)" : boxBg}
              fontSize="sm"
              fontWeight="500"
              color={textColorSecondary}
              borderRadius="7px"
              onClick={() => {
                changeGraphInterval("quarter");
                changeTimeSelect("quarter");
              }}
              width="50px"
              height="35px"
              ml="10px"
              mr="10px"
            >
              3M
            </Button>
            <Button
              bg={timeSelect === "half" ? "rgb(230,230,230)" : boxBg}
              fontSize="sm"
              fontWeight="500"
              color={textColorSecondary}
              borderRadius="7px"
              onClick={() => {
                changeGraphInterval("half");
                changeTimeSelect("half");
              }}
              width="50px"
              height="35px"
              ml="10px"
              mr="10px"
            >
              6M
            </Button>
            <Button
              bg={timeSelect === "year" ? "rgb(230,230,230)" : boxBg}
              fontSize="sm"
              fontWeight="500"
              color={textColorSecondary}
              borderRadius="7px"
              onClick={() => {
                changeGraphInterval("year");
                changeTimeSelect("year");
              }}
              width="50px"
              height="35px"
              ml="10px"
              mr="10px"
            >
              1Y
            </Button>
          </Flex>
          <Flex flexDirection="row" justifyContent="center" mt="40px" mb="5px">
            <Flex justifyContent="flex-end">
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                width="220px"
              >
                <BuyButton />
                <SellButton />
                <ConvertButton />
              </Flex>
            </Flex>
            <Flex flexDirection="column" mt="10px">
              <MoreVertOutlinedIcon
                alignItems="center"
                style={{ fontSize: "40px", color: "rgb(220, 220, 220)" }}
              />
            </Flex>
            <Flex justifyContent="flex-start">
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                width="150px"
              >
                <DepositButton />
                <WithdrawButton />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  ) : (
    <></>
  );
}
