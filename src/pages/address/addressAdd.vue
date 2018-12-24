<template>
  <div class="full-height default-bg">
    <van-cell-group>
      <van-field
        v-model.trim="name"
        label="收货人"
        placeholder="请输入收货人"
      />
      <van-field
        v-model.trim="phone"
        label="联系电话"
        type="number"
        placeholder="请输入联系电话"
      />
      <van-field
        v-model="area"
        label="所在地区"
        placeholder="请选择省市"
        readonly
        @focus="showArea = true"
      />
      <van-field
        v-model.trim="address"
        type="textarea"
        placeholder="请填写详细地址（如门牌号等），不少于5个字"
        rows="1"
        :autosize="{maxHeight:80,minHeight:80}"
      />
    </van-cell-group>
    <van-checkbox class="mt-7 ml-4 small" v-model="isDefault">
      <span class="position-relative margin-top-m1">设为默认寄件地址</span>
    </van-checkbox>
    <van-popup position="bottom" v-model="showArea">
      <van-area :value="areaValue" @confirm="setArea" @cancel="showArea = false" :area-list="areaList" />
    </van-popup>
    <div class="full-width d-flex justify-content-center">
      <van-button class="confirm-address mt-7" @click="addAddress">
        保存
      </van-button>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import {
  getAllpro,
  getCityByProCode,
  getCountryByCityCode
} from '../../api/address/index'

export default {
  data () {
    return {
      addressDomain: {},
      addresses: [],
      showArea: false,
      isDefault: false,
      name: '',
      phone: '',
      area: '',
      address: '',
      areaList: {},
      areaListIds: {},
      isEdit: false,
      proCode: '',
      cityCode: '',
      areaCode: '',
      proId: '',
      cityId: '',
      areaId: '',
      areaValue: ''
    }
  },
  methods: {
    init () {
      this.getAddresses()
      if (this.$router.currentRoute.query.editId) {
        this.isEdit = true
        this.setDefaultAddress()
      }
      if (!localStorage.areaListSave) {
        this.setAreaList()
      }
      this.getAreaList()
    },
    setArea (data) {
      this.proCode = data[0] ? data[0].code : ''
      this.cityCode = data[1] ? data[1].code : ''
      this.areaCode = data[2] ? data[2].code : ''
      this.proId = this.areaListIds.province_list[data[0].code]
      this.cityId = this.areaListIds.city_list[data[1].code]
      this.areaId = this.areaListIds.county_list[data[2].code]
      this.areaValue = this.areaCode ? this.areaCode : this.cityCode
      let result = ''
      data.forEach(item => {
        if (item) {
          result += `${item.name}  `
        }
      })
      this.area = result
      this.showArea = false
    },
    addAddress () {
      if (!this.name) {
        this.$toast('请输入收件人')
        return false
      }
      if (!this.phone) {
        this.$toast('请输入联系电话')
        return false
      }
      if (!(this.phone.match(/^(11[0-9]|12[0-9]|13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!this.area) {
        this.$toast('请选择地区')
        return false
      }
      if (!this.address) {
        this.$toast('请输入详细地址')
        return false
      }
      if (this.address.length < 5) {
        this.$toast('地址不能少于5个字')
        return false
      }
      let addressObj = {
        proCode: this.proCode,
        cityCode: this.cityCode,
        areaCode: this.areaCode,
        proId: this.proId,
        cityId: this.cityId,
        areaId: this.areaId,
        name: this.name,
        phone: this.phone,
        isDefault: this.isDefault,
        location: this.formLocation(),
        deleteChoose: false
      }
      if (!this.isEdit) {
        addressObj = Object.assign(addressObj, {id: `qwerty${new Date().getTime()}`})
        this.addresses.push(addressObj)
      } else {
        let index = _.findIndex(this.addresses, {id: this.addressDomain.id})
        addressObj = Object.assign(addressObj, {id: this.$router.currentRoute.query.editId})
        this.addresses[index] = addressObj
      }
      if (addressObj.isDefault) {
        this.addresses.forEach(item => {
          if (item.id !== addressObj.id) {
            item.isDefault = false
          }
        })
      }
      localStorage.setItem('addresses', JSON.stringify(this.addresses))
      // if (this.$router.currentRoute.query.from) {
      //   this.$router.back(-1)
      // } else {
      //   this.$router.push({name: 'addressList', query: {noBottom: true}})
      // }
      this.$router.back(-1)
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    },
    formLocation () {
      let result = ''
      let arr = this.area.split('  ')
      result = `${arr.join(' / ')}${this.address}`
      return result
    },
    setDefaultAddress () {
      let obj = _.find(this.addresses, {id: this.$router.currentRoute.query.editId})
      this.addressDomain = obj
      this.address = obj
      this.name = obj.name
      this.phone = obj.phone
      this.isDefault = obj.isDefault
      this.address = _.last(obj.location.split(' / '))
      this.area = (_.dropRight(obj.location.split(' / '))).join('  ')
      this.area += '  '
      this.proCode = obj.proCode
      this.cityCode = obj.cityCode
      this.areaCode = obj.areaCode
      this.areaValue = obj.areaCode ? obj.areaCode : obj.cityCode
    },
    setAreaList () {
      this.areaList = {}
      this.areaListIds = {}
      getAllpro()
        .then(res => {
          let proObj = {}
          let cityObj = {}
          let countryObj = {}
          let proIdObj = {}
          let cityIdObj = {}
          let countryIdObj = {}
          res.data.data.forEach(item => {
            let obj = {
              [`${item.code}0000`]: item.provinceName
            }
            let idObj = {
              [`${item.code}0000`]: item.id
            }
            getCityByProCode({
              provinceCode: item.code
            })
              .then(res => {
                if (res.data.data && res.data.data.length > 0) {
                  res.data.data.forEach(cityItem => {
                    let citySubObj = {
                      [`${cityItem.code}00`]: cityItem.cityName
                    }
                    let idCitySubObj = {
                      [`${cityItem.code}00`]: cityItem.id
                    }
                    getCountryByCityCode({
                      cityCode: cityItem.code
                    })
                      .then(res => {
                        if (res.data.data && res.data.data.length > 0) {
                          res.data.data.forEach(countryItem => {
                            let countrySubObj = {
                              [`${countryItem.code}`]: countryItem.countyName
                            }
                            let idCountrySubObj = {
                              [`${countryItem.code}`]: countryItem.id
                            }
                            countryObj = Object.assign(countryObj, countrySubObj)
                            countryIdObj = Object.assign(countryIdObj, idCountrySubObj)
                          })
                        }
                        this.areaList = Object.assign(this.areaList, {county_list: countryObj})
                        this.areaListIds = Object.assign(this.areaListIds, {county_list: countryIdObj})
                        localStorage.setItem('areaListSave', JSON.stringify(this.areaList))
                        localStorage.setItem('areaListSaveIds', JSON.stringify(this.areaListIds))
                      })
                    cityObj = Object.assign(cityObj, citySubObj)
                    cityIdObj = Object.assign(cityIdObj, idCitySubObj)
                  })
                }
                this.areaList = Object.assign(this.areaList, {city_list: cityObj})
                this.areaListIds = Object.assign(this.areaListIds, {city_list: cityIdObj})
              })
            proObj = Object.assign(proObj, obj)
            proIdObj = Object.assign(proIdObj, idObj)
          })
          this.areaList = Object.assign(this.areaList, {province_list: proObj})
          this.areaListIds = Object.assign(this.areaListIds, {province_list: proIdObj})
        })
    },
    getAreaList () {
      this.areaList = JSON.parse(localStorage.areaListSave)
      this.areaListIds = JSON.parse(localStorage.areaListSaveIds)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
  .confirm-address{
    background: rgb(0, 153, 67);
    width: 94%;
    height: 38px;
    border-radius: 50px;
    color: white;
    line-height: 38px;
  }
  .van-cell{
    span{
      font-weight: bold !important;
    }
  }
  .margin-top-m1{
    margin-top: -1px !important;
  }
</style>
