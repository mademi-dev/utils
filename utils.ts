
// ███╗░░░███╗░█████╗░██████╗░███████╗███╗░░░███╗██╗
// ████╗░████║██╔══██╗██╔══██╗██╔════╝████╗░████║██║
// ██╔████╔██║███████║██║░░██║█████╗░░██╔████╔██║██║
// ██║╚██╔╝██║██╔══██║██║░░██║██╔══╝░░██║╚██╔╝██║██║
// ██║░╚═╝░██║██║░░██║██████╔╝███████╗██║░╚═╝░██║██║
// ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░╚══════╝╚═╝░░░░░╚═╝╚═╝


/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */

import React, { useEffect, useRef, } from 'react';
import jalaali from 'jalaali-js';
import { Action, } from 'redux';
import { GridSize, } from '@mui/material';

export enum PasswordPolicy {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

export enum LoginTypes {
  Username = 1,
  Mobile = 2
}

export enum CalendarType {
  Jalali = 1,
  Gregorian = 2
}

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];
const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const PERSIAN_DAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

const ENGLISH_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getMonthName = (month: number, isJalali: boolean) => (isJalali ? PERSIAN_MONTHS[month - 1] : ENGLISH_MONTHS[month - 1]);
const getDayName = (day: number, isJalali: boolean) => (isJalali ? PERSIAN_DAYS[day] : ENGLISH_DAYS[day]);

function getJalaliDateString(dateString: string, includeTime: boolean = false) {
  if (dateString) {
    const date = new Date(dateString);
    const time = includeTime ? ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` : '';
    const {
      jy, jm, jd,
    } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${jd} ${getMonthName(jm, true)} ${jy}${time}` ;
  }
  return '';
}

// return date as dd/mm/yy
function getJalaliDateNumeric(dateString: string) {
  const date = new Date(dateString);
  const {
    jy, jm, jd,
  } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${jd} / ${jm} / ${jy}`;
}

function getCalendarDateString(input: Date, calendarType: CalendarType, separator = '-') {
  const date = new Date(input);
  if (calendarType === CalendarType.Jalali) {
    const {
      jy, jm, jd,
    } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${jy}${separator}${jm}${separator}${jd}`;
  } else {
    return `${date.getFullYear()}${separator}${date.getMonth() + 1}${separator}${date.getDate()}`;
  }
}

export function getDayAndMonthFromDate(dateString: string) {
  if (dateString) {
    const date = new Date(dateString);
    return date.getDate() + ' ' + getMonthName(date.getMonth(), false);

  }
  return '';
}

function getNow(isJalali: boolean) {
  try {
    const date = new Date();

    if (isJalali) {
      const {
        jy, jm, jd,
      } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return {
        year: jy,
        month: jm,
        day: jd,
        dayName: getDayName(jd, true),
        monthName: getMonthName(jm, true),
      };
    }
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dayName: getDayName(date.getDate(), false),
      monthName: getMonthName(date.getMonth(), false),

    };
  } catch (err) {
    return {
      year: 0,
      month: 0,
      day: 0,
      dayName: '',
      monthName: '',
    };
  }
}

const renderHTML = (rawHTML: string | null) => React.createElement('div', { dangerouslySetInnerHTML: { __html: rawHTML || '', }, });

function trimText(input: string, length: number) {
  if (input) return input.length > length ? `${input.substring(0, length)}...` : input;
  return '';
}
const imageLoader = ({ src, }: any) => `${src}`;

function formatNumber(inputNumber: number | undefined | null, delimiter = ','): string {
  if (inputNumber) {
    const temp = `${inputNumber}`;
    const separator = delimiter || ',';
    const split = temp.split('.');
    split[0] = split[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${separator}`);
    return split.join('.');
  }
  return '';
}

interface AppAction<T = string, P = any> extends Action {
  type: T;
  payload: P;
}

interface RepeatColumns {
  xs?: GridSize | boolean;
  sm?: GridSize | boolean;
  md?: GridSize | boolean;
  lg?: GridSize | boolean;
  xl?: GridSize | boolean;
}

function sortByKey(array: any, key: any) {
  return array.sort((a: any, b: any) => {
    const x = a[key]; const y = b[key];
    let result = 0;
    if (x < y) {
      result = -1;
    } else if (x > y) {
      result = 1;
    }
    return result;
  });
}

function isNumeric(str: string) {
  if (typeof str !== 'string') return false; // we only process strings!
  return !Number.isNaN(str) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    && !Number.isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
  } catch (err) {

  }
  return '';
}

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

function addMonths(date: any, months: number) {
  const d = date.getDate();
  date.setMonth(date.getMonth() + months);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date;
}

function addMinutes(date: any, minutes: number) {
  const d = new Date(date);
  d.setMinutes(date.getMinutes() + minutes);
  return d;
}

interface PasswordScore {
  hasNormalLetter: boolean;
  hasCaptialLetter: boolean;
  hasNumber: boolean;
  hasSpecialCharacter: boolean;
  passwordLength: number;
}

function checkPasswordScore(password: string): PasswordScore {
  const score: PasswordScore = {
    hasNormalLetter: (/[a-z]+/).test(password),
    hasCaptialLetter: (/[A-Z]+/).test(password),
    hasNumber: (/[0-9]+/).test(password),
    hasSpecialCharacter: (/[$@#&!]+/).test(password),
    passwordLength: password.length,
  };
  return score;
}
function calculateTotalScore(score: PasswordScore, currentPolicy: PasswordPolicy): number {
  let result = 0;

  if (score.hasNormalLetter) { result += 1; }
  if (score.hasCaptialLetter) { result += 1; }
  if (score.hasNumber) { result += 1; }
  if (score.hasSpecialCharacter) { result += 1; }

  let requiredLength = 6;
  switch (currentPolicy) {
    case PasswordPolicy.EASY:
      requiredLength = 6;
      break;
    case PasswordPolicy.MEDIUM:
      requiredLength = 7;
      break;
    case PasswordPolicy.HARD:
      requiredLength = 8;
      break;
    default:
      requiredLength = 6;
      break;
  }
  if (score.passwordLength >= requiredLength) { result += 1; }

  return result;
}

function checkLogin(session: any) {
  return session && !session.error && new Date() < new Date(session.expires);
}

function convertHMS(value: string) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);

  let hourString = '';
  if (hours > 0) {
    hourString = (hours >= 10 ? '' : '0') + hours + ':';
  }

  return hourString +
    (minutes >= 10 ? minutes : '0' + minutes) + ':' +
    (seconds >= 10 ? seconds : '0' + seconds);
}


function convertDateToString(currentdate = new Date(), dateSeparator = '-') {
  return currentdate.getFullYear() + dateSeparator
    + (currentdate.getMonth() + 1) + dateSeparator
    + currentdate.getDate() + ' '
    + currentdate.getHours() + ':'
    + currentdate.getMinutes() + ':'
    + currentdate.getSeconds();
}

function convertStringToDate(date: string, dateSeparator = '-') {
  if (date) {
    const currentdate = new Date(date);
    return currentdate.getFullYear() + dateSeparator
    + (currentdate.getMonth() + 1) + dateSeparator
    + currentdate.getDate() + '  '
    + currentdate.getHours() + ':'
    + currentdate.getMinutes() + ':'
    + currentdate.getSeconds();
  }
  return '';
}

function printCurrentTime(currentdate = new Date()) {
  console.log(convertDateToString(currentdate));
}

function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value, ]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

function getNextMonth(date: Date) {
  if (date.getMonth() == 11) {
    return new Date(date.getFullYear() + 1, 0, 1);
  } else {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }
}

function getPrevMonth(date: Date) {
  if (date.getMonth() == 0) {
    return new Date(date.getFullYear() - 1, 11, 1);
  } else {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }
}

// persian to english letters
const map = {
  'ض': 'q',
  'ص': 'w',
  'ث': 'e',
  'ق': 'r',
  'ف': 't',
  'غ': 'y',
  'ع': 'u',
  'ه': 'i',
  'خ': 'o',
  'ح': 'p',
  'ج': '[',
  'چ': ']',
  'ش': 'a',
  'س': 's',
  'ی': 'd',
  'ب': 'f',
  'ل': 'g',
  'ا': 'h',
  'ت': 'j',
  'ن': 'k',
  'م': 'l',
  'ک': ';',
  'گ': '\'',
  'پ': '\\',
  'ظ': 'z',
  'ط': 'x',
  'ز': 'c',
  'ر': 'v',
  'ذ': 'b',
  'د': 'n',
  'ئ': 'm',
  'و': ',',
  '.': '.',
  '/': '/',
};
const changeFaToEn = (el: any) => {
  return el.replace(
    /[ض ص ث ق ف غ ع ه خ ح ج چ ش س ی ب ل ا ت ن م ک گ پ ظ ط ز ر ذ د ئ و]/g,
    (match: keyof typeof map) => {
      return map[match];
    });
};

//its a generator to convert string condition oprators to finding access controll
// ex:
//  const access = useAccess( 'ADMIN&EDIT_USERS|SUPER_ADMIN' , [ ADMIN , EDIT_USERS ] ,'&','|');
// and thats return boolean type
const useAccess = (  
  _init: string,
  _DB: string[],
  _CUSTOMAND: string = ',',
  _CUSTOMOR: string = '|' 
     ) => {
  let 
    and:string[] = _init.split(_CUSTOMAND),
    tempAnsw1:boolean[] = [],
    tempAnsw2:boolean[] = [];

    for (let i = 0; i < and.length; i++) {
      const el = and[i];
      if(el.includes(_CUSTOMOR)){
        let or=el.split(_CUSTOMOR);
        for (let j = 0; j < or.length; j++) {
          const item = or[j];
          tempAnsw1.push(_DB.includes(item))
        };
        if (tempAnsw1.includes(true)) {
          tempAnsw2.push(true);
          if(and.length !== 1) continue;
          else return true
        }else return false;
      }else{
        if(and.length===1) {
          tempAnsw2.push(_DB.includes(el));
          return _DB.includes(el);
        } else { 
          tempAnsw2.push(_DB.includes(el)); 
          continue;
        }
      }
    };
    return !tempAnsw2.includes(false)
}

export {
useAccess,
  PERSIAN_MONTHS,
  ENGLISH_MONTHS,
  newGuid,
  getJalaliDateString,
  getMonthName,
  renderHTML,
  getNow,
  trimText,
  imageLoader,
  formatNumber,
  getJalaliDateNumeric,
  sortByKey,
  isNumeric,
  parseJwt,
  addMonths,
  addMinutes,
  checkPasswordScore,
  calculateTotalScore,
  checkLogin,
  convertHMS,
  usePrevious,
  printCurrentTime,
  convertDateToString,
  convertStringToDate,
  toBase64,
  shimmer,
  getNextMonth,
  getPrevMonth,
  getCalendarDateString,
  changeFaToEn,
};
export type {
  AppAction, 
  RepeatColumns, 
  PasswordScore,
};
