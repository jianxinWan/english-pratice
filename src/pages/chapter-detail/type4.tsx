import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import {
  AtTextarea,
  AtMessage,
  AtButton,
  AtTabBar,
  AtImagePicker,
  AtAccordion
} from "taro-ui";
import NavBar from "@/components/nav-bar";
import "./index.scss";
import { IProps } from "./type1";

interface IExerciseInfo {
  thinking: string;
  title_html: string;
  answer: string;
}

const baseInfo = {
  stem_id: 1,
  chapter_id: 1,
  question_id: 1
};

const Index = ({ data, toNext, onChange }: IProps) => {
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
  const [hasAnswer, setHasAnswer] = useState<boolean>(false);
  const [showThinking, setShowThinking] = useState<boolean>(true);
  const [textVal, setTextVal] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<any>([]);

  /**
   * 切换提交方式卡片
   */
  const handleChange = useCallback(
    (item) => {
      setTabIndex(item);
    },
    [tabIndex]
  );

  useEffect(() => {
    onChange(4, [
      {
        value: textVal
      },
      {
        value: imageFiles
      }
    ]);
  }, [onChange]);

  useEffect(() => {
    const { stem_parent_questions, user_answer_info } = data;
    if (!stem_parent_questions && !stem_parent_questions.length) return;
    setExerciseInfo(stem_parent_questions[0]);
    if (user_answer_info) {
      console.log(user_answer_info);
      const { answer_array } = user_answer_info;
      const answer = JSON.parse(answer_array);
      setTextVal(answer[0].value);
      setImageFiles(answer[1].value);
      setHasAnswer(true);
    }
  }, []);

  if (!exerciseInfo) return null;
  const { title_html, answer } = exerciseInfo;

  return (
    <View className="writing-detail-wrapper ">
      <AtMessage />
      <View className="nav-bar">
        <NavBar title="" />
      </View>
      <View className="writing-content" style={{ padding: "0 5px 30px" }}>
        {title_html && (
          <RichText
            style={{
              margin: ".53333rem .64rem 0",
              color: "#666",
              fontSize: ".59733rem",
              lineHeight: ".896rem"
            }}
            className="at-article__p exercise-wrapper"
            nodes={title_html}
          />
        )}
        <View className="answer-wrapper">
          <AtTabBar
            tabList={[
              { title: "文本作答", iconType: "edit" },
              { title: "拍照上传", iconType: "camera" }
            ]}
            onClick={handleChange}
            current={tabIndex}
          />
          {tabIndex === 0 && (
            <AtTextarea
              autoFocus
              count={true}
              maxLength={2000}
              value={textVal}
              onChange={(val: string) => setTextVal(val)}
              placeholder="Answer here"
            />
          )}
          {tabIndex === 1 && (
            <AtImagePicker
              files={imageFiles}
              onChange={(files) => setImageFiles(files)}
              onFail={() =>
                Taro.atMessage({
                  message: "上传出错！请稍后再试",
                  type: "error"
                })
              }
            />
          )}
        </View>
        {hasAnswer && (
          <AtAccordion
            title="查看解析："
            open={showThinking}
            onClick={(value: any) => setShowThinking(value)}
          >
            <RichText className="at-article__p" nodes={answer} />
          </AtAccordion>
        )}
        <AtButton type="primary" onClick={() => toNext(4)}>
          下一题
        </AtButton>
      </View>
    </View>
  );
};

export default Index;
