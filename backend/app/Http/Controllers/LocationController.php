<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Province;
use App\Models\District;
use App\Models\Ward;

class LocationController extends Controller
{
    public function getProvinces()
    {
        $provinces = Province::all()->makeHidden(['administrative_unit_id', 'administrative_region_id', 'full_name_en']);
        return response()->json($provinces);
    }

    public function getDistrictsByProvince($provinceCode)
    {
        $districts = District::where('province_code', $provinceCode)->get()
        ->makeHidden(['administrative_unit_id', 'administrative_region_id', 'full_name_en']);
        return response()->json($districts);
    }

    public function getWardsByDistrict($districtCode)
    {
        $wards = Ward::where('district_code', $districtCode)->get()
        ->makeHidden(['administrative_unit_id', 'administrative_region_id', 'full_name_en']);
        return response()->json($wards);
    }
}