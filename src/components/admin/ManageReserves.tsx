import { renderTimeViewClock, StaticDateTimePicker } from "@mui/x-date-pickers";
import { Card } from "@mui/material";
import { HiOutlineClock, HiOutlineCalendar } from "react-icons/hi";

import { AdapterMomentJalaali } from "@mui/x-date-pickers/AdapterMomentJalaali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { Moment } from "jalali-moment";
import moment from "jalali-moment";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/initialize";
import uniqueIdGenerator from "../../helpers/uniqueIdGenerator";
import { reservredDatesArrayType } from "../../types/types";
import { getReserves } from "../../services/services";
import { convertToPersianDate } from "../../helpers/convertToPersianDate";

const ManageReserves = ({
  setDates,
}: {
  setDates: React.Dispatch<React.SetStateAction<reservredDatesArrayType[]>>;
}) => {
  const [date, setDate] = useState<Moment | null>(null);
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="flex flex-col gap-5 items-center max-w-[300px] pb-[20px]">
      <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
        <StaticDateTimePicker
          onChange={(newValue) => setDate(newValue)}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          ampm={false}
          minDate={moment(new Date())}
        />
      </LocalizationProvider>

      <Card className="w-full !text-white flex flex-col items-start p-2 !bg-[#00A9FF]">
        <h3 className="text-black font-bold">زمان و تاریخ انتخابی </h3>
        <div className="self-start mt-5">
          <p className="flex gap-2 items-center">
            <HiOutlineCalendar className="w-[20px] h-[20px]" />
            <span>
              {convertToPersianDate(
                new Date(date?.toDate() ?? new Date()),
                "date",
              )}
            </span>
          </p>
          <p className="flex gap-2 items-center">
            <HiOutlineClock className="w-[20px] h-[20px]" />
            <span>
              {convertToPersianDate(date?.toDate() ?? new Date(), "time")}
            </span>
          </p>
        </div>
      </Card>
      <LoadingButton
        className="!w-full"
        variant="contained"
        loading={buttonLoading}
        onClick={async () => {
          try {
            setButtonLoading(true);

            // insert new date into db
            const { error } = await supabase.from("reserves").insert([
              {
                date,
                id: uniqueIdGenerator(),
              },
            ]);

            if (error) throw error;

            const { data: reserves } = await getReserves();
            if (reserves) setDates(reserves);

            navigate("/admin/see");
          } catch (error) {
            console.error(error);
          } finally {
            setButtonLoading(false);
          }
        }}
      >
        تایید زمان و تاریخ
      </LoadingButton>
    </div>
  );
};
export default ManageReserves;