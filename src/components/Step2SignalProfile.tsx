import React, { useRef } from 'react';
import { Image, Trash2, Link } from 'lucide-react';

export interface Step2Data {
  idealType: string;
  bio: string;
  photos: string[]; // Base64 or object URLs
  snsLink: string;
  photoFiles?: File[];
}

interface Step2Props {
  data: Step2Data;
  updateData: (fields: Partial<Step2Data>) => void;
  errors: Record<string, string>;
}

export const Step2SignalProfile: React.FC<Step2Props> = ({ data, updateData, errors }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const remainingSlots = 5 - data.photos.length;
      const allowedFiles = filesArray.slice(0, remainingSlots);

      const promises = allowedFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((newPhotos) => {
        updateData({
          photos: [...data.photos, ...newPhotos],
          photoFiles: [...(data.photoFiles || []), ...allowedFiles]
        });
      });
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = data.photos.filter((_, i) => i !== index);
    const updatedFiles = (data.photoFiles || []).filter((_, i) => i !== index);
    updateData({
      photos: updatedPhotos,
      photoFiles: updatedFiles
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-sans text-xl font-bold text-[#00C7B5] tracking-wider">Step 2. Signal Profile</h3>
        <p className="text-xs text-stone-500 font-light mt-1">당신의 취향과 개성을 표현해 주세요.</p>
      </div>

      {/* 여행 스타일 소개 */}
      <div className="space-y-2 text-left">
        <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase">나의 여행 스타일</label>
        <textarea
          rows={3}
          placeholder="어떤 스타일의 여행을 떠나고 싶으신가요? 선호하는 여행 방식이나 성향을 적어주세요."
          value={data.idealType}
          onChange={(e) => updateData({ idealType: e.target.value })}
          className={`w-full px-4 py-3 bg-white border ${
            errors.idealType ? 'border-red-500/70 focus:border-red-500' : 'border-stone-300 focus:border-[#00C7B5]/80'
          } rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none resize-none transition-all duration-300`}
        />
        {errors.idealType && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.idealType}</p>}
      </div>

      {/* 자기소개 */}
      <div className="space-y-2 text-left">
        <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase">자기소개</label>
        <textarea
          rows={3}
          placeholder="참가자들에게 어필할 나만의 매력이나 여행 성향을 적어주세요."
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
          className={`w-full px-4 py-3 bg-white border ${
            errors.bio ? 'border-red-500/70 focus:border-red-500' : 'border-stone-300 focus:border-[#00C7B5]/80'
          } rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none resize-none transition-all duration-300`}
        />
        {errors.bio && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.bio}</p>}
      </div>

      {/* 파일 업로드 UI (약 30% 축소 적용) */}
      <div className="space-y-2 text-left">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase">개인 사진 업로드 (최대 5장)</label>
          <span className="text-[10px] text-stone-500">{data.photos.length} / 5</span>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-[320px]">
          {data.photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg border border-stone-200 overflow-hidden group">
              <img src={photo} alt={`profile-${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {data.photos.length < 5 && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="aspect-square rounded-lg border-2 border-dashed border-stone-300 hover:border-[#00C7B5]/40 flex flex-col items-center justify-center text-stone-400 hover:text-[#00C7B5] transition-colors cursor-pointer bg-stone-50"
            >
              <Image size={16} className="mb-0.5" />
              <span className="text-[8px]">추가</span>
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <p className="text-[10px] text-stone-500 font-light italic mt-1.5">
          * 가장 자연스러운 본인의 모습을 올려주세요. (최소 1장 이상 등록 권장)
        </p>
        {errors.photos && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.photos}</p>}
      </div>

      {/* 개인 SNS 주소 (선택) */}
      <div className="space-y-2 text-left">
        <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase">개인 SNS 주소 (인스타그램, 블로그 등 - 선택)</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Link size={15} />
          </span>
          <input
            type="text"
            placeholder="instagram.com/your_account"
            value={data.snsLink}
            onChange={(e) => updateData({ snsLink: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 bg-white border ${
              errors.snsLink ? 'border-red-500/70 focus:border-red-500' : 'border-stone-300 focus:border-[#00C7B5]/80'
            } rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-300`}
          />
        </div>
        <p className="text-[10px] text-stone-500 font-light italic mt-1">
          * 본인의 분위기를 알 수 있는 계정을 남겨주시면, 훨씬 더 정교하고 완벽한 취향 매칭이 가능합니다.
        </p>
        {errors.snsLink && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.snsLink}</p>}
      </div>
    </div>
  );
};
