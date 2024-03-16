export type FileInfoType = "d" | "-" | "l";
export interface IFileInfo {
  type: FileInfoType;
  name: string;
  size: number;
  modifyTime: number;
  accessTime: number;
  rights: {
    user: string;
    group: string;
    other: string;
  };
  owner: number;
  group: number;
}
