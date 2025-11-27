<?php

namespace App\Http\Requests\Room;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roomId = $this->route('room');

        return [
            'room_number' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('rooms', 'room_number')->ignore($roomId),
            ],
            'beds' => 'sometimes|required|integer|min:1',
            'is_active' => 'sometimes|nullable|boolean',
        ];
    }
}
