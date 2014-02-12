/**
 * Created by xiaofen on 14-2-12.
 */
function SignUp(name, phone, activity_id) {
    this.name = name;
    this.phone = phone;
    this.activity_id = activity_id
}
SignUp.render_sign_ups = function (activity_id) {
    var sign_ups = JSON.parse(localStorage.sign_ups);
    return _.filter(sign_ups, function (sign_up) {
        return sign_up.activity_id == activity_id;
    });
}