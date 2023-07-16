<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发货单状态" prop="dispatchStatus">
        <el-select v-model="queryParams.dispatchStatus" placeholder="请选择发货单状态" clearable>
          <el-option
            v-for="dict in dict.type.dispatch"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发货单号" prop="dispatchNo">
        <el-input
          v-model="queryParams.dispatchNo"
          placeholder="请输入发货单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="搅拌站号" prop="mixingPlant">
        <el-select v-model="queryParams.mixingPlant" placeholder="请选择搅拌站号" clearable>
          <el-option
            v-for="dict in dict.type.mixing_plant"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发货时间" prop="dispatchTime">
        <el-date-picker clearable
          v-model="queryParams.dispatchTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车号" prop="carNo">
        <el-input
          v-model="queryParams.carNo"
          placeholder="请输入车号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驾驶员" prop="driverName">
        <el-select v-model="queryParams.driverName" placeholder="请选择驾驶员" clearable>
          <el-option
            v-for="dict in dict.type.driver_pilot"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发货员" prop="dispatchPerson">
        <el-input
          v-model="queryParams.dispatchPerson"
          placeholder="请输入发货员"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="混凝土发货单id" align="center" prop="id" />
      <el-table-column label="发货单状态" align="center" prop="dispatchStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.dispatch" :value="scope.row.dispatchStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="客户id" align="center" prop="clientId" />
      <el-table-column label="财务单id" align="center" prop="financeId" />
      <el-table-column label="发货单号" align="center" prop="dispatchNo" />
      <el-table-column label="搅拌站号" align="center" prop="mixingPlant">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mixing_plant" :value="scope.row.mixingPlant"/>
        </template>
      </el-table-column>
      <el-table-column label="发货时间" align="center" prop="dispatchTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dispatchTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本车方量" align="center" prop="cubicNumber" />
      <el-table-column label="累计车次" align="center" prop="trainNumber" />
      <el-table-column label="量计方量" align="center" prop="accumulativeTotalCubicNumber" />
      <el-table-column label="强度等级" align="center" prop="strengthGrade" />
      <el-table-column label="浇筑部位" align="center" prop="placingPosition" />
      <el-table-column label="浇筑方式" align="center" prop="placingMethod" />
      <el-table-column label="坍落度" align="center" prop="slump" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="车号" align="center" prop="carNo">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.car_no" :value="scope.row.carNo"/>
        </template>
      </el-table-column>
      <el-table-column label="驾驶员" align="center" prop="driverName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.driver_pilot" :value="scope.row.driverName"/>
        </template>
      </el-table-column>
      <el-table-column label="发货员" align="center" prop="dispatchPerson" />
      <el-table-column label="收货人" align="center" prop="consignee" />
      <el-table-column label="到达时间" align="center" prop="arrivalTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.arrivalTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到达备注" align="center" prop="signRemark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改发货单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发货单状态" prop="dispatchStatus">
          <el-select v-model="form.dispatchStatus" placeholder="请选择发货单状态">
            <el-option
              v-for="dict in dict.type.dispatch"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户id" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item label="财务单id" prop="financeId">
          <el-input v-model="form.financeId" placeholder="请输入财务单id" />
        </el-form-item>
        <el-form-item label="发货单号" prop="dispatchNo">
          <el-input v-model="form.dispatchNo" placeholder="请输入发货单号" />
        </el-form-item>
        <el-form-item label="搅拌站号" prop="mixingPlant">
          <el-select v-model="form.mixingPlant" placeholder="请选择搅拌站号">
            <el-option
              v-for="dict in dict.type.mixing_plant"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货时间" prop="dispatchTime">
          <el-date-picker clearable
            v-model="form.dispatchTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="本车方量" prop="cubicNumber">
          <el-input v-model="form.cubicNumber" placeholder="请输入本车方量" />
        </el-form-item>
        <el-form-item label="累计车次" prop="trainNumber">
          <el-input v-model="form.trainNumber" placeholder="请输入累计车次" />
        </el-form-item>
        <el-form-item label="量计方量" prop="accumulativeTotalCubicNumber">
          <el-input v-model="form.accumulativeTotalCubicNumber" placeholder="请输入量计方量" />
        </el-form-item>
        <el-form-item label="强度等级" prop="strengthGrade">
          <el-input v-model="form.strengthGrade" placeholder="请输入强度等级" />
        </el-form-item>
        <el-form-item label="浇筑部位" prop="placingPosition">
          <el-input v-model="form.placingPosition" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="浇筑方式" prop="placingMethod">
          <el-input v-model="form.placingMethod" placeholder="请输入浇筑方式" />
        </el-form-item>
        <el-form-item label="坍落度" prop="slump">
          <el-input v-model="form.slump" placeholder="请输入坍落度" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="车号" prop="carNo">
          <el-input v-model="form.carNo" placeholder="请输入车号" />
        </el-form-item>
        <el-form-item label="驾驶员" prop="driverName">
          <el-select v-model="form.driverName" placeholder="请选择驾驶员">
            <el-option
              v-for="dict in dict.type.driver_pilot"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货员" prop="dispatchPerson">
          <el-input v-model="form.dispatchPerson" placeholder="请输入发货员" />
        </el-form-item>
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="form.consignee" placeholder="请输入收货人" />
        </el-form-item>
        <el-form-item label="到达时间" prop="arrivalTime">
          <el-date-picker clearable
            v-model="form.arrivalTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择到达时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到达备注" prop="signRemark">
          <el-input v-model="form.signRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/system/order";

export default {
  name: "Order",
  dicts: ['driver_pilot', 'dispatch', 'mixing_plant'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 发货单管理表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dispatchStatus: null,
        dispatchNo: null,
        mixingPlant: null,
        dispatchTime: null,
        placingPosition: null,
        carNo: null,
        driverName: null,
        dispatchPerson: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dispatchStatus: [
          { required: true, message: "发货单状态不能为空", trigger: "change" }
        ],
        clientId: [
          { required: true, message: "客户id不能为空", trigger: "blur" }
        ],
        dispatchNo: [
          { required: true, message: "发货单号不能为空", trigger: "blur" }
        ],
        mixingPlant: [
          { required: true, message: "搅拌站号不能为空", trigger: "change" }
        ],
        dispatchTime: [
          { required: true, message: "发货时间不能为空", trigger: "blur" }
        ],
        cubicNumber: [
          { required: true, message: "本车方量不能为空", trigger: "blur" }
        ],
        trainNumber: [
          { required: true, message: "累计车次不能为空", trigger: "blur" }
        ],
        accumulativeTotalCubicNumber: [
          { required: true, message: "量计方量不能为空", trigger: "blur" }
        ],
        strengthGrade: [
          { required: true, message: "强度等级不能为空", trigger: "blur" }
        ],
        placingPosition: [
          { required: true, message: "浇筑部位不能为空", trigger: "blur" }
        ],
        placingMethod: [
          { required: true, message: "浇筑方式不能为空", trigger: "blur" }
        ],
        slump: [
          { required: true, message: "坍落度不能为空", trigger: "blur" }
        ],
        carNo: [
          { required: true, message: "车号不能为空", trigger: "blur" }
        ],
        driverName: [
          { required: true, message: "驾驶员不能为空", trigger: "change" }
        ],
        dispatchPerson: [
          { required: true, message: "发货员不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询发货单管理列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        dispatchStatus: null,
        clientId: null,
        financeId: null,
        dispatchNo: null,
        mixingPlant: null,
        dispatchTime: null,
        cubicNumber: null,
        trainNumber: null,
        accumulativeTotalCubicNumber: null,
        strengthGrade: null,
        placingPosition: null,
        placingMethod: null,
        slump: null,
        remark: null,
        carNo: null,
        driverName: null,
        dispatchPerson: null,
        consignee: null,
        arrivalTime: null,
        signRemark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加发货单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改发货单管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除发货单管理编号为"' + ids + '"的数据项？').then(function() {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
