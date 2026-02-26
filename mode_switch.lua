-- Custom Mode Switch Script for ATHENA H743 PRO
-- RC Channel 8 (left slider) controls flight mode
-- 0-16% slider = Loiter Mode
-- >16% slider = Stabilize Mode

local last_mode = 5  -- Start with Loiter
local LOITER_MODE = 5
local STABILIZE_MODE = 0
local last_check_ms = 0

function update()
    local now_ms = millis()
    
    -- Check every 100ms (10Hz)
    if now_ms - last_check_ms < 100 then
        return update, 10
    end
    last_check_ms = now_ms
    
    local rc8_pwm = rc:get_pwm(8)  -- Get RC8 PWM value
    
    -- Validate PWM
    if rc8_pwm < 800 or rc8_pwm > 2200 then
        return update, 10
    end
    
    -- Convert PWM to percentage (1000-2000 range)
    local percent = (rc8_pwm - 1000) / 10  -- 0-100%
    
    -- Clamp to 0-100
    if percent < 0 then percent = 0 end
    if percent > 100 then percent = 100 end
    
    -- Determine desired mode
    local desired_mode
    if percent <= 16 then
        desired_mode = LOITER_MODE
    else
        desired_mode = STABILIZE_MODE
    end
    
    -- Switch mode if changed
    if desired_mode ~= last_mode then
        if vehicle:set_mode(desired_mode) then
            last_mode = desired_mode
            local mode_name = "Loiter"
            if desired_mode == STABILIZE_MODE then
                mode_name = "Stabilize"
            end
            gcs:send_text(6, "Mode: " .. mode_name .. " (" .. math.floor(percent) .. "%)")
        end
    end
    
    return update, 10
end

-- Initialize
gcs:send_text(6, "Mode Switch Script Loaded")

return update, 100
