import {
  Typography,
  Row,
  Col,
  Drawer,
  Empty,
  Spin,
  notification,
  Modal,
  Badge,
  Table,
  Space,
} from "antd";
import { arabicAlphabet, morphemes } from "../../../Constants/Constant";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import SettingPage from "../SettingPage/SettingPage";
import { useAppSelector } from "../../../redux/hook/hook";
import { RootState } from "../../../redux/store";
import {
  getAllMorphemesData,
  getRootWords,
} from "../../../Actions/morphemeActions/MorphemeRoutes";
import { version } from "../../../../package.json";
import DisplayMorphemes from "./DisplayMorphemes/DisplayMorphemes";
import { getVersionInfo } from "../../../Actions/VersionInfo/VersionInfo";
import { useLocation } from "react-router-dom";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;
interface WordData {
  word_number: string;
}
export default function MainPage() {
  const {
    morphemeSwitch,
    wordSwitch,
    darkMode,
    quranicWords,
    fonts,
    fontSize,
    color,
    language,
    activeKey,
  } = useAppSelector((state: RootState) => state.settingReducer);
  const [open, setOpen] = useState(false);
  const [saveOpen, showSaveOpen] = useState<boolean>(false);
  const [mainData, setMainData] = useState<any>([]);
  const [rootWords, setRootWords] = useState<any>([]);
  const [saveWords, setSaveWords] = useState<any>([]);
  const [rootWord, setRootWord] = useState<any>({});
  const [alphabet, setAlphabet] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [rootLoader, setRootLoader] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [laravelVer, setlaravelVer] = useState("");
  const [selectedWord, setSelectedWord] = useState<any>([]);


  const antIcon = (
    <LoadingOutlined style={{ fontSize: 35 }} spin className="text-green-900" />
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rootParam = {
    rootWord: searchParams.get("rootWord"),
  };
  const rootWorded = location?.state?.rootWord || rootParam;
  useEffect(() => {
    getLaravelVersion();
    if (rootWords?.length > 0) {
      getMorphemesData();
    } else if (rootWorded) {
      getMorphemesData();
    }
  }, [rootWord]);

  useEffect(() => {
    getRootWord();
  }, [alphabet]);

  function getRootWord() {
    setRootLoader(true);
    getRootWords().then(({ data: response }) => {
      try {
        if (response.success === true) {
          const sortedData = response.list.sort(
            (a: { isExist: any }, b: { isExist: any }) => {
              if (a.isExist && !b.isExist) {
                return -1;
              } else if (!a.isExist && b.isExist) {
                return 1;
              } else {
                return 0;
              }
            }
          );
          const filterRootWords = sortedData.filter((item: any) =>
            item.seperateRootWord.startsWith(alphabet?.alphabet)
          );
          if (filterRootWords?.length > 0) {
            setRootWords(filterRootWords);
          } else {
            setRootWords(sortedData);
          }
          setRootLoader(false);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  function getLaravelVersion() {
    getVersionInfo()
      .then(({ data: response }) => {
        if (response.success === true) {
          setlaravelVer(response.serverVersion);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getMorphemesData() {
    setLoader(true);
    getAllMorphemesData(
      Object.keys(rootWord).length === 0 ? rootWorded : rootWord
    )
      .then(({ data: response }) => {
        try {
          if (response.success === true) {
            const updatedWeightsAndGroups = response?.list?.map(
              (weightGroup: any, index: number) => ({
                ...weightGroup,
                meaning: morphemes[index]?.meaning,
                morpheme: morphemes[index]?.morpheme,
              })
            );
            setMainData(updatedWeightsAndGroups);
            setLoader(false);
          }
        } catch (error) {
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        setMainData([]);
        Notification.requestPermission(function (status) {
          if (status === "granted") {
            notification.error({
              message: "Error",
              description: error.message,
            });
          }
        });
      });
  }

  function handleRootChange(key: string) {
    const payload = {
      rootWord: key,
    };
    setRootWord(payload);
  }
  function handleAlphabetChange(key: string) {
    const payload = {
      alphabet: key,
    };
    setRootWord({});
    delete rootWorded?.rootWord;
    setAlphabet(payload);
  }

  const showDrawer = () => {
    setOpen(true);
  };
  const showSaveDrawer = () => {
    showSaveOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const handleOk = () => {
    showSaveOpen(false);
  };
  const handleSelected = (data: any) => {
    setSaveWords([...saveWords, data]);
    setSelected(true);
  };
  const handleSelectedWord = (data: WordData) => {
    setSelectedWord([ ...selectedWord, data.word_number]);
  }
  console.log(saveWords);
  
  const columns = [
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'Word Number',
      dataIndex: 'word_number',
      key: 'word_number',
    },
    {
      title: 'Template',
      dataIndex: 'template',
      key: 'template',
    },
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: 'Morpheme No',
      dataIndex: 'morpheme_no',
      key: 'morpheme_no',
    },
  ];
  return (
    <div className="text-gray-950">
      <Row gutter={[16, 16]}>
        <Col md={saveWords?.length > 0 ? 11 : 12}>
          <Title
            level={2}
            className={`apply-font ${
              darkMode ? "!text-white" : "!text-black"
            } `}
            style={{ fontFamily: fonts, fontSize: fontSize }}
          >
            Morphemes
          </Title>
        </Col>
        <Col md={6} className="text-right">
          <Select
            allowClear
            loading={rootLoader}
            disabled={rootLoader}
            style={{ width: "100%" }}
            placeholder="Select Root Word"
            onChange={handleRootChange}
            value={
              Object.keys(rootWord).length === 0
                ? rootWorded?.rootWord
                : rootWord?.rootWord
            }
            options={rootWords?.map((item: any) => ({
              key: item?.id,
              value: item?.englishWord,
              disabled: item?.isExist === false ? true : false,
              className:
                item?.isExist === false ? "bg-red-200 !text-black" : "",
              label: (
                <>
                  <span
                    className={`apply-font text-base`}
                    style={{ fontFamily: fonts, fontSize: fontSize }}
                  >
                    {item?.rootWord}
                  </span>
                </>
              ),
            }))}
          />
        </Col>
        <Col md={5} className="text-right">
          <Select
            allowClear
            style={{ width: "100%" }}
            placeholder="Select Arabic Alphabet"
            onChange={handleAlphabetChange}
            options={arabicAlphabet?.map((item: any) => ({
              key: item?.letter,
              value: item?.letter,
              label: item?.letter,
            }))}
          />
        </Col>
        <Col md={saveWords?.length > 0 ? 2:1} className="pt-1 ">
          <Space><Settings
            className={`apply-font ${
              darkMode ? "!text-white" : "!text-black"
            } cursor-pointer ml-5`}
            onClick={showDrawer}
          />
           {saveWords?.length > 0 && (
           <Badge count={saveWords?.length}>
            <SaveOutlined
              className={`apply-font ${
                darkMode ? "!text-white" : "!text-black"
              } cursor-pointer text-xl ml-5`}
              onClick={showSaveDrawer}
            />
            </Badge>
              )}</Space>
        </Col>      
      </Row>
      <br />
      <Row>
        <Col md={24}>
          <Spin spinning={loader} size="large" indicator={antIcon}>
            {mainData?.length > 0 ? (
              mainData[0].groups.length > 0 ? (
                <DisplayMorphemes
                  mainData={mainData}
                  darkMode={darkMode}
                  morphemeSwitch={morphemeSwitch}
                  wordSwitch={wordSwitch}
                  quranicWords={quranicWords}
                  fonts={fonts}
                  fontSize={fontSize}
                  color={color}
                  language={language}
                  handleSelected={handleSelected}
                  selected={selected}
                  activeKey={activeKey}
                  saveWords={saveWords}
                  handleSelectedWord={handleSelectedWord}
                  selectedWord={selectedWord}
                  rootWord={
                    Object.keys(rootWord).length === 0 ? rootWorded : rootWord
                  }
                />
              ) : (
                <Empty
                  className=" mt-56"
                  description="We are still working to complete our database. The words for this root have not yet been incorporated into our database.Please check back later."
                />
              )
            ) : (
              <Empty className=" mt-56" />
            )}
          </Spin>
        </Col>
      </Row>
      <Drawer
        width={500}
        title="Settings"
        placement="right"
        onClose={onClose}
        open={open}
        className={`${darkMode ? " !bg-dark-blue !text-white " : ""}`}
        footer={
          <>
            <div
              className={`${
                darkMode
                  ? " bg-dark-blue text-white m-0 p-4 text-center"
                  : "m-0 p-4 text-center"
              }`}
            >
              React {version} &nbsp; Laravel {laravelVer}
            </div>
          </>
        }
      >
        <SettingPage />
      </Drawer>
      <Modal
        title="Saved Words"
        open={saveOpen}
        onOk={handleOk}
        width={700}
        onCancel={handleOk}
        okText={"View Saved Words"}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Table columns={columns} dataSource={saveWords} scroll={{y:400}} pagination={false} />
      </Modal>
    </div>
  );
}
